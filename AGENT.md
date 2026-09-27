# AGENT.md — Developer & AI Agent Reference Manual

> **Project:** VCET Vazhi Kaati (College Indoor Campus Navigation)  
> **Repository:** `vcet_vazhi_kaati`  
> **Target Campus:** Velalar College of Engineering and Technology (VCET)

---

## 1. Executive Summary

**VCET Vazhi Kaati** is an interactive, web-based indoor navigation system designed for the Velalar College of Engineering and Technology campus. It enables students, faculty, and visitors to select starting locations and destinations to visualize the campus blueprint, view exact room locations, and follow an animated shortest-path route along corridors.

---

## 2. Project Directory Structure

```
vcet_vazhi_kaati/
├── AGENT.md                            # Technical architecture & reference guide (this file)
├── README.md                           # Public repository overview
├── frontend/
│   ├── gemini-code-1790494007157.html  # Main application UI entry point & SVG view
│   ├── mapConfig.js                    # Declarative configuration (rooms, structures, nodes, edges)
│   ├── script.js                       # Map rendering engine, Dijkstra routing & animation
│   └── style.css                       # Application styles, responsive layout & SVG animations
└── backend/
    ├── DESCRIPTION.md                  # Next.js / PostgreSQL technical reference & schema design
    └── lib/                            # Reserved for future server-side graph services
```

---

## 3. Frontend Architecture

The frontend follows a **declarative, data-driven architecture**. No room coordinates, waypoint positions, or network lines are hardcoded into static SVG XML. Everything is parameterized in [mapConfig.js](file:///E:/vcet_vazhi_kaati/frontend/mapConfig.js) and dynamically rendered by [script.js](file:///E:/vcet_vazhi_kaati/frontend/script.js).

### 3.1 Technology Stack
- **HTML5 & SVG**: Native vector graphics scaled with a `viewBox="0 0 1200 900"`.
- **CSS3**: Flexbox UI controls, CSS drop-shadows, and smooth state transitions.
- **Vanilla JavaScript (ES6+)**: Zero external runtime framework dependencies. Compatible with both direct file opening (`file://`) and web servers.
- **svg-pan-zoom (v3.6.1)**: CDN library providing smooth mouse dragging, pinch-to-zoom, and zoom controls.

---

## 4. Configuration Schema (`mapConfig.js`)

All visual elements and graph networks are configured in [mapConfig.js](file:///E:/vcet_vazhi_kaati/frontend/mapConfig.js).

### 4.1 Room Definition (`MAP_ROOMS`)
Defines interactive classrooms, labs, offices, and halls.

```javascript
{
    id: 'AILab',                      // Unique identifier string
    name: 'AI Laboratory',            // Full human-readable name (used in dropdowns)
    lines: ['AI Laboratory'],         // Array of text lines displayed on the SVG map
    x: 260,                           // Top-left X coordinate in SVG units
    y: 95,                            // Top-left Y coordinate in SVG units
    width: 190,                       // Box width in SVG units
    height: 60,                       // Box height in SVG units
    fill: '#9bc6ff',                  // Room background color (hex)
    textClass: 'text-sm',             // CSS font class ('text-xs' | 'text-sm' | 'text-main')
    textColor: '#000033',             // (Optional) Label color override
    node: 'TL_Corner',                // Nearest navigation waypoint node ID
    isPolygon: false,                 // (Optional) Set true if custom polygon shape
    points: 'x1,y1 x2,y2 ...'         // (Required only if isPolygon: true)
}
```

### 4.2 Structural Elements (`STRUCTURAL_RECTS`)
Defines outer building walls, corridors, garden/grass patches, obstacles, and entrance steps.
- Fields: `id`, `x`, `y`, `width`, `height`, `fill`, `stroke`, `strokeWidth`, `class`.

### 4.3 Navigation Waypoints (`MAP_NODES`)
Corridor junction points and room access points used by the pathfinding algorithm:

```javascript
'N_Recpt_Door': { x: 600, y: 660, label: 'Reception Door' }
```

### 4.4 Corridors & Edges (`MAP_EDGES`)
Corridor paths connecting any two nodes. The SVG engine automatically draws dashed corridor lines connecting these pairs, and Dijkstra uses them as walkable segments:

```javascript
['N_Recpt_Door', 'N_Recpt_Hall']
```

---

## 5. Map Engine & Routing Core (`script.js`)

### 5.1 Dynamic SVG Layers
The SVG viewport contains dedicated SVG `<g>` groups:
- `#structures-layer`: Background walls, corridors, grass lawns, obstacles, direction markers.
- `#rooms-layer`: Interactive room rectangles and automatically centered text labels.
- `#network-layer`:
  - `#edges-group`: Visual dashed corridor lines.
  - `#nodes-group`: Red waypoint circles with hover tooltips.
  - `#active-route`: Highlighted green path trace when navigating.
  - `#animated-dot`: Blue pulsed beacon moving node-by-node along the route.

### 5.2 Auto-Centering Label Calculation
Whenever room dimensions change, labels are automatically centered:
$$\text{cx} = x + \frac{\text{width}}{2}$$
$$\text{cy} = y + \frac{\text{height}}{2}$$

For multi-line text arrays with $N$ lines and line height $lh$:
$$\text{startY} = \text{cy} - \frac{(N - 1) \times lh}{2}$$
$$\text{lineY}_i = \text{startY} + i \times lh$$

### 5.3 Shortest-Path Algorithm (Dijkstra)
Implemented in [`findShortestPath(startNode, endNode)`](file:///E:/vcet_vazhi_kaati/frontend/script.js#L237-L277):
1. Initializes distances to $\infty$, start node distance to $0$.
2. Uses priority queue sorted by cumulative Euclidean distance ($\sqrt{\Delta x^2 + \Delta y^2}$).
3. Explores adjacent nodes via `MAP_EDGES`.
4. Reconstructs and returns an ordered array of node IDs from origin to destination.

---

## 6. How-To Guide for Future Agents & Developers

### 6.1 Resizing or Moving a Room
1. Open [mapConfig.js](file:///E:/vcet_vazhi_kaati/frontend/mapConfig.js).
2. Locate the room object in `MAP_ROOMS`.
3. Adjust `x`, `y`, `width`, or `height`.
4. **No other changes required.** The label automatically centers, and SVG re-renders on page refresh.

### 6.2 Adding a New Room
1. Add a new object to `MAP_ROOMS` with a unique `id`, `name`, dimensions (`x`, `y`, `width`, `height`), color, and the nearest `node`.
2. The room will automatically:
   - Render on the SVG canvas.
   - Display centered text.
   - Appear in both Source and Destination dropdown selectors.
   - Support click-to-select destination.

### 6.3 Moving a Waypoint Node
1. Find the node ID in `MAP_NODES`.
2. Update its `x` and `y` coordinates.
3. The red waypoint circle, all connected corridor lines in `MAP_EDGES`, and the animated routing beacon will immediately adopt the new coordinates.

### 6.4 Connecting Two Nodes with a Walkway
1. Add `['NodeA', 'NodeB']` to `MAP_EDGES`.
2. The visual corridor line and the navigation routing engine will automatically incorporate the new edge.

---

## 7. Backend Technical Vision (`backend/DESCRIPTION.md`)

The backend specification outlines a future Next.js + PostgreSQL (Neon) service:
- **v0.1**: Static room-to-room hops with pre-written text instructions.
- **v0.2**: Metric coordinates on nodes, junction waypoints, and geometry-derived turn-by-turn instructions ("turn left", "turn right").
- **v0.3**: Integration connecting the database routing API with frontend floorplan overlays.

---

## 8. Development Verification Commands

When making modifications to the JavaScript code or configuration data, execute these validation commands in PowerShell:

```powershell
# 1. Syntax check on configuration and engine scripts
node -c frontend/mapConfig.js
node -c frontend/script.js

# 2. Verify graph integrity (no broken node references in rooms or edges)
node -e "const cfg = require('./frontend/mapConfig.js'); const badRooms = cfg.MAP_ROOMS.filter(r => !cfg.MAP_NODES[r.node]); const badEdges = cfg.MAP_EDGES.filter(([a,b]) => !cfg.MAP_NODES[a] || !cfg.MAP_NODES[b]); console.log('Bad room nodes:', badRooms.length, '| Bad edge nodes:', badEdges.length);"
```
