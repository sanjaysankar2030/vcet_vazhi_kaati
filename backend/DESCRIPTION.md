# College Indoor Navigation API — Technical Reference

---

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Version Roadmap](#2-version-roadmap)
3. [Database Schema — v0.1](#3-database-schema--v01)
4. [Database Schema — v0.2 (Coordinates)](#4-database-schema--v02-coordinates)
5. [Coordinate System Decision](#5-coordinate-system-decision)
6. [Routing Engine](#6-routing-engine)
7. [Turn Direction Generation (v0.2)](#7-turn-direction-generation-v02)
8. [API Endpoint](#8-api-endpoint)
9. [Response Contracts](#9-response-contracts)
10. [Error Contracts](#10-error-contracts)
11. [Frontend Rendering (v0.3)](#11-frontend-rendering-v03)
12. [Database Hosting — Neon](#12-database-hosting--neon)
13. [Environment Configuration](#13-environment-configuration)
14. [Why Not GPS / Dead Reckoning (Scope Note)](#14-why-not-gps--dead-reckoning-scope-note)
15. [Common Mistakes to Avoid](#15-common-mistakes-to-avoid)

---

## 1. Project Structure

```
project-root/
│
├── pages/api/
│   └── route.ts              -- single endpoint, GET /api/route
│
├── lib/
│   ├── db.ts                 -- pg Pool, Neon pooled connection
│   ├── graph.ts               -- adjacency list builder
│   ├── dijkstra.ts            -- shortest path algorithm
│   └── turns.ts                -- v0.2: geometry-based instruction generation
│
├── db/
│   └── schema.sql             -- CREATE TABLE statements
│
└── components/                -- v0.3 only
    └── RouteOverlay.tsx        -- SVG polyline over floor plan image
```

Two logical layers, no more:
- **Data layer** — `rooms` + `connections` (v0.1) / `nodes` + `edges` (v0.2), plain CRUD, no smart logic
- **Routing layer** — loads the graph, runs Dijkstra, formats the response

No service/repository/controller split (Spring-style layering) is used here — a single API route function does load → route → format, because the whole request is one linear operation with no independent business rules to isolate.

---

## 2. Version Roadmap

| Version | Adds | Coordinates? | Instructions from |
|---|---|---|---|
| v0.1 | `rooms`, `connections`, Dijkstra, text-only response | No | Hand-written per edge |
| v0.2 | `x`, `y` on nodes, junction nodes separate from rooms | Yes (local meters) | Generated from geometry |
| v0.3 | Frontend SVG overlay on floor plan image | Yes (reused) | N/A (visual only) |

Each version is additive. v0.2 does not replace the v0.1 API response shape — it only adds fields (`x`, `y` per step) so existing consumers don't break.

---

## 3. Database Schema — v0.1

Rooms are graph nodes directly. No junctions, no coordinates. Adjacency and instruction text are hand-entered, not derived.

```sql
CREATE TABLE rooms (
    id      TEXT PRIMARY KEY,        -- 'library', 'principal_office'
    name    TEXT NOT NULL             -- 'Library', 'Principal Office'
);

CREATE TABLE connections (
    id            SERIAL PRIMARY KEY,
    from_room     TEXT NOT NULL REFERENCES rooms(id),
    to_room       TEXT NOT NULL REFERENCES rooms(id),
    instruction   TEXT NOT NULL,      -- 'take left', 'walk past it'
    weight        NUMERIC NOT NULL DEFAULT 1
);
```

**Directionality is explicit, not flagged.** There is no `bidirectional` boolean — a corridor walked in each direction needs different instruction text ("take left" one way isn't "take right" walked back necessarily; direction-dependent phrasing can't be derived from a single row). Both directions are inserted as separate rows:

```sql
INSERT INTO connections (from_room, to_room, instruction) VALUES
  ('library', 'principal_office', 'take left'),
  ('principal_office', 'library', 'take right');
```

`weight` defaults to `1` — shortest path = fewest hops until real distances exist in v0.2.

---

## 4. Database Schema — v0.2 (Coordinates)

Rooms and junctions both become `nodes`. A junction is a corridor intersection or turn point with no dispatch destination — it exists purely to give the path shape. Rooms attach as points of interest along edges, not as standalone traversal targets, so mid-route callouts ("walk past X on your left") are possible.

```sql
CREATE TABLE nodes (
    id      TEXT PRIMARY KEY,
    x       NUMERIC NOT NULL,         -- local meters from building origin
    y       NUMERIC NOT NULL,
    floor   INTEGER NOT NULL DEFAULT 1,
    type    TEXT NOT NULL DEFAULT 'junction'
            CHECK (type IN ('junction', 'room', 'stairs', 'entrance'))
);

CREATE TABLE edges (
    id      SERIAL PRIMARY KEY,
    node_a  TEXT NOT NULL REFERENCES nodes(id),
    node_b  TEXT NOT NULL REFERENCES nodes(id),
    weight  NUMERIC     -- null = auto-compute from (x,y) distance at query time
);
```

If mid-corridor room callouts are needed later, split rooms back out into their own table keyed to an edge + side + offset:

```sql
CREATE TABLE rooms (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    edge_id     INTEGER NOT NULL REFERENCES edges(id),
    side        TEXT NOT NULL CHECK (side IN ('left', 'right')),
    offset_pct  NUMERIC NOT NULL CHECK (offset_pct BETWEEN 0 AND 1),
    entry_node  TEXT NOT NULL REFERENCES nodes(id)   -- nearest routable node
);
```

`entry_node` is denormalized on purpose — every route request resolves a room to its nearest node as both start and end, so storing it avoids recomputing offset math per request.

**Multi-floor:** `stairs`/`elevator` type nodes come in pairs, same physical location, different `floor`, connected by an edge with an explicit `weight` (not auto-computed from coordinates, since floor-change cost isn't a straight-line distance):

```sql
INSERT INTO nodes VALUES ('stairs_a_f1', 50, 30, 1, 'stairs');
INSERT INTO nodes VALUES ('stairs_a_f2', 50, 30, 2, 'stairs');
INSERT INTO edges (node_a, node_b, weight) VALUES ('stairs_a_f1', 'stairs_a_f2', 25);
```

---

## 5. Coordinate System Decision

**Store `x`/`y` in local meters, anchored to one fixed building reference point (e.g., main entrance = origin `(0,0)`). Not latitude/longitude, not raw pixels.**

Reasoning:
- **Distance calculation** — plain Euclidean (`sqrt((x2-x1)² + (y2-y1)²)`) gives real meters directly, usable as edge weight with no correction factor. Lat/lng requires haversine (accounts for Earth's curvature) to get accurate distance, which is irrelevant complexity at building scale and loses precision at sub-meter resolution.
- **Manual survey-ability** — meters-from-a-fixed-point is measurable with a tape measure or laser distance meter. Precise lat/lng at indoor, sub-meter accuracy would require survey-grade GPS equipment that also wouldn't function reliably indoors (see §14).
- **No calibration step at draw time** — pixel coordinates on a floor plan image work directly with SVG/canvas but tie the stored data to one specific image's resolution. Meters + a single global `metersToPixels` scale constant, computed once, decouples stored data from any particular image asset:

```javascript
const metersToPixels = 40; // e.g. a known 12m corridor measures 480px -> scale = 40
function toPixel(point) {
  return { px: point.x * metersToPixels, py: point.y * metersToPixels };
}
```

---

## 6. Routing Engine

Dijkstra, unmodified, no heuristic. At the scale of a single college building (a few hundred nodes), A*'s heuristic-guided exploration is not worth the added complexity — Dijkstra explores the full graph fast enough that the difference is not measurable.

```javascript
function shortestPath(graph, start, end) {
  const dist = { [start]: 0 };
  const prev = {};
  const visited = new Set();
  const pq = [[0, start]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u === end) break;

    for (const { to, weight, instruction } of graph[u] || []) {
      const nd = d + weight;
      if (nd < (dist[to] ?? Infinity)) {
        dist[to] = nd;
        prev[to] = { from: u, instruction };
        pq.push([nd, to]);
      }
    }
  }

  const path = [];
  let node = end;
  while (node !== start) {
    if (!prev[node]) return null; // no path exists
    const { from, instruction } = prev[node];
    path.unshift({ from, to: node, instruction });
    node = from;
  }
  return { path, distance: dist[end] };
}
```

Swap the linear `pq.sort()` for a binary heap if the graph grows past a few thousand nodes — not needed at college-building scale.

**Adjacency list is rebuilt from the DB on every request** (not cached), since the graph is small and cheap to reload, and this avoids any staleness bugs if rooms/edges are edited between requests.

```javascript
function buildGraph(connections) {
  const graph = {};
  for (const { from_room, to_room, weight, instruction } of connections) {
    (graph[from_room] ??= []).push({ to: to_room, weight, instruction });
  }
  return graph;
}
```

---

## 7. Turn Direction Generation (v0.2)

Once nodes carry `x`/`y`, instruction text is derived instead of hand-written. For each consecutive triplet `(prev, curr, next)` in the resolved path, compute the signed angle between the incoming and outgoing direction vectors:

```javascript
function turnDirection(prev, curr, next) {
  const v1 = [curr.x - prev.x, curr.y - prev.y];
  const v2 = [next.x - curr.x, next.y - curr.y];
  const cross = v1[0] * v2[1] - v1[1] * v2[0];
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const angleDeg = Math.atan2(cross, dot) * (180 / Math.PI);

  if (Math.abs(angleDeg) < 20) return 'straight';
  return angleDeg > 0 ? 'left' : 'right';
}
```

- Cross product sign gives turn direction — verify once against a known corridor in the actual dataset and flip the left/right mapping if the coordinate handedness is opposite.
- ~20° threshold absorbs minor coordinate/measurement noise so slight bends aren't reported as turns.
- Rooms attached to a traversed edge but not the destination emit `"walk past {name} on your {side}"`; the destination room emits `"{name} is on your {side}"` instead of a turn instruction.

---

## 8. API Endpoint

```
GET /api/route?from={room_id}&to={room_id}
```

Single endpoint for both v0.1 and v0.2 — the query parameters don't change, only the response payload grows.

---

## 9. Response Contracts

**v0.1 — text only:**

```json
{
  "from": "library",
  "to": "staff_room",
  "distance": 3,
  "steps": [
    { "room_id": "library", "room_name": "Library", "instruction": "take left" },
    { "room_id": "principal_office", "room_name": "Principal Office", "instruction": "walk past it" },
    { "room_id": "staff_room", "room_name": "Staff Room", "instruction": null }
  ]
}
```

- `instruction: null` on the final step means arrived — frontend renders this as an arrival message, not a blank instruction.
- `room_id` (lookup/keying) and `room_name` (display) are kept separate deliberately; frontend should never derive one from the other.

**v0.2 — same shape, additive fields only:**

```json
{
  "from": "library",
  "to": "staff_room",
  "distance": 12.4,
  "steps": [
    { "room_id": "library", "room_name": "Library", "instruction": "take left", "x": 10, "y": 20 }
  ]
}
```

Existing v0.1 consumers keep working unmodified since no field is removed or renamed.

---

## 10. Error Contracts

Use real HTTP status codes — never `200` with an error object buried in the body.

| Condition | Status | Body |
|---|---|---|
| Unknown `from`/`to` room id | `404` | `{ "error": "Room not found", "detail": "No room with id 'x' exists" }` |
| Valid rooms, no connecting path (disconnected graph) | `422` | `{ "error": "No path found", "detail": "..." }` |
| Missing query params | `400` | `{ "error": "Missing parameter", "detail": "..." }` |

---

## 11. Frontend Rendering (v0.3)

Path coordinates from the v0.2 response are drawn as an SVG polyline positioned absolutely over an `<img>` of the floor plan, matched to the image's native dimensions via `viewBox` (gives free responsive scaling with no manual resize math):

```jsx
function RouteOverlay({ path, imageWidth, imageHeight }) {
  const points = path.map(p => `${p.x * 40},${p.y * 40}`).join(' '); // metersToPixels = 40
  return (
    <svg viewBox={`0 0 ${imageWidth} ${imageHeight}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {path.map((p, i) => <circle key={i} cx={p.x * 40} cy={p.y * 40} r={6} fill="#dc2626" />)}
    </svg>
  );
}
```

---

## 12. Database Hosting — Neon

Neon over Supabase/Render for this project: permanent free tier (no card, no expiry clock), scale-to-zero rather than the project pausing after inactivity, and no unused platform surface (auth/storage/realtime) that Supabase bundles in but this project doesn't need.

**Serverless connection gotcha:** use Neon's **pooled** connection string (PgBouncer-backed, shown separately in the Neon dashboard, often a `-pooler` hostname), not the direct one, for `DATABASE_URL`. Regular `pg.Pool` under Vercel/Netlify serverless functions can open a new connection per invocation and exhaust Postgres's connection limit under any real traffic if pointed at the direct connection string.

---

## 13. Environment Configuration

```bash
# .env (never commit this file)
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

```javascript
// lib/db.ts
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
export default pool;
```

Set via `vercel env add DATABASE_URL` (or Netlify's Site settings → Environment variables) — never hardcoded in source.

---

## 14. Why Not GPS / Dead Reckoning (Scope Note)

This project is static routing + map display only — no live position tracking. Recorded here to prevent scope creep back into it:

- **GPS is unusable indoors at this precision requirement.** Trilateration needs direct satellite line-of-sight; roofs/concrete/steel attenuate the signal and multipath reflections off interior surfaces corrupt the time-delay calculation. Typical indoor error is 10–50m, which covers multiple rooms simultaneously when rooms are 3–5m apart.
- **Dead reckoning** (accelerometer + gyroscope step accumulation from a known anchor) is a legitimate approach for future live tracking, but it is a separate project. It outputs local Cartesian displacement in meters — which is *why* this project's coordinates are already stored in local meters rather than lat/lng: no conversion needed if the two projects are ever merged later.
- Lat/lng has no role in this project unless outdoor-to-indoor routing (campus gate → building entrance) is added — even then, the outdoor GPS fix would be converted once to the local meter frame at the entrance node, not stored per-room.

---

## 15. Common Mistakes to Avoid

| Mistake | Why It's a Problem | Fix |
|---|---|---|
| Using lat/lng for indoor coordinates | Sub-meter precision needed indoors; haversine complexity buys nothing at building scale | Local meters from a fixed building origin |
| Treating rooms as reachable purely by nearest raw coordinate distance | Straight-line distance ignores walls; fails on any non-convex layout | Route only along explicit graph edges |
| Single `connections` row for a bidirectional corridor | Instruction text is direction-dependent; can't be derived from one row | Insert both directions as separate rows |
| Returning `200` with an error object in the body | Breaks standard HTTP error handling on the client | Use real status codes (`404`, `422`, `400`) |
| Using Neon's direct (non-pooled) connection string in a serverless function | Exhausts Postgres connection limit under concurrent invocations | Use the pooled/PgBouncer connection string |
| Hardcoding coordinates to one floor plan image's pixel space | Ties stored data to one specific image asset/resolution | Store meters; convert to pixels only at render time via one scale constant |
| Adding A* prematurely | Heuristic complexity unjustified at a few hundred nodes | Plain Dijkstra until the graph is demonstrably large enough to need it |
| Building dead reckoning / GPS tracking into this project's scope | Separate concern, separate project, different data needs | Keep this project static routing + display only |
