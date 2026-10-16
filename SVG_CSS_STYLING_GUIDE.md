# Comprehensive Guide to SVG CSS Styling in VCET Vazhi Kaati

> **Applies to:** [`frontend/VCET_Navigation_F1_F2_Updated.html`](file:///E:/vcet_vazhi_kaati/frontend/VCET_Navigation_F1_F2_Updated.html)  
> **Target Scope:** Waypoint Nodes, Walkway Edges, Rooms, Corridors, Doors, Floors, Active Routes, Animated Beacons, Direction Badges, and Text Labels.

---

## 1. Architecture Overview: How SVGs & Styles Work Together

In this application, the map is rendered as an interactive, multi-layer vector graphic inside an HTML5 `<svg id="campus-map">` viewport.

```
VCET_Navigation_F1_F2_Updated.html (Host Webpage)
│
├── css/style.css                <-- PRIMARY FILE TO EDIT (Single Source of Truth)
│
├── js/load-components.js        <-- Fetches & injects HTML components and SVG floors
│   ├── components/map-container.html   <-- Global SVG canvas, Direction badges & Animated dots
│   └── svg/*.svg                       <-- Floor blueprints (G, F1, F2, F3, F4, F5)
│
└── js/script.js                 <-- Dynamically creates <line> edges, <circle> nodes & path d="..."
```

### The Ingestion Pipeline
1. **`VCET_Navigation_F1_F2_Updated.html`** loads `css/style.css` in its `<head>`.
2. **`components/map-container.html`** injects the root `<svg id="campus-map">` and `<g id="map-content">`.
3. **`js/load-components.js`** fetches each floor SVG file (`svg/ground-floor.svg`, `svg/first-floor.svg`, etc.), extracts the floor group (e.g. `<g id="floor-G">`), strips any embedded legacy `<style>` tags to prevent style conflicts, and attaches it into `#map-content`.
4. **`js/script.js`** dynamically creates SVG `<line class="path-line">` elements for walkway edges and `<circle class="path-node">` / `<circle class="door-node">` elements for waypoint nodes.
5. **Because all SVG elements end up in the active HTML DOM and internal SVG styles are stripped, rules defined in [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) are the 100% single source of truth and cascade cleanly onto every SVG element across all floors.**

---

## 2. File Location Map: What to Change & Where

| Element Category | Primary File to Change | Exact Target Selector / Class / ID | Secondary / Inline File |
| :--- | :--- | :--- | :--- |
| **Theme & Color Variables** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `:root { --variable-name: value; }` | N/A |
| **Waypoint Nodes (Junctions)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.path-node` | [`frontend/js/script.js`](file:///E:/vcet_vazhi_kaati/frontend/js/script.js#L469-L484) |
| **Door Nodes (Entrances)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.door-node` | [`frontend/js/script.js`](file:///E:/vcet_vazhi_kaati/frontend/js/script.js#L469-L484) |
| **Walkway Edges (Dashed Lines)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.path-line` | [`frontend/js/script.js`](file:///E:/vcet_vazhi_kaati/frontend/js/script.js#L450-L467) |
| **Corridors (Walkway outlines)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.corridor-base`, `.corridor-inner` | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) (d paths) |
| **Active Navigation Route** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.route-highlight` | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) (`#highlighted-path-*`) |
| **Moving Animated Dot** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `#animated-dot` | [`frontend/components/map-container.html`](file:///E:/vcet_vazhi_kaati/frontend/components/map-container.html#L34) |
| **Live GPS Dot & Pulse** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `#live-dot`, `#pulse-ring`, `@keyframes pulse` | [`frontend/components/map-container.html`](file:///E:/vcet_vazhi_kaati/frontend/components/map-container.html#L35-L38) |
| **Room Outlines & Borders** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.room`, `.room rect`, `.room polygon` | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) |
| **Individual Room Colors** | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) | `fill="..."` attribute on `<rect>` / `<polygon>` | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) (via CSS attribute selectors) |
| **Door Rectangles (Physical)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.door-rect` | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) under `<g id="physical-doors-g">` |
| **Text Labels & Typography** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.text-main`, `.text-sm`, `.text-xs`, `.room-label*` | [`frontend/svg/*.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg) (`<text>` tags) |
| **Direction Badges (N/S/E/W)** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `.direction-box`, `.direction-text` | [`frontend/components/map-container.html`](file:///E:/vcet_vazhi_kaati/frontend/components/map-container.html#L23-L31) |
| **Floor-Specific Overrides** | [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) | `#floor-G`, `#floor-F1`, `#floor-F2`, etc. | Top of respective `svg/*.svg` |

---

## 3. Quick Theme Customization Using CSS Variables

At the top of [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css), a centralized `:root` token block controls all major visual attributes. Changing a variable here updates the entire map immediately:

```css
:root {
    /* Corridors */
    --corridor-outer-color: #000000;       /* Outer corridor border */
    --corridor-outer-width: 14px;          /* Outer thickness */
    --corridor-inner-color: #ffffff;       /* Inner walkable hallway color */
    --corridor-inner-width: 10px;          /* Inner hallway width */

    /* Walkway Network (Edges & Nodes) */
    --edge-line-color: #6699ff;            /* Dashed corridor lines */
    --edge-line-width: 2px;
    --edge-line-dash: 8, 5;                /* Dash length, gap length */
    --edge-line-opacity: 0.6;

    --node-path-fill: #ffffff;             /* Waypoint node fill */
    --node-path-stroke: #ff9999;           /* Waypoint node border */
    --node-path-radius: 4px;               /* Waypoint node size */

    --node-door-fill: #ffcc00;             /* Room door node fill */
    --node-door-stroke: #cc0000;           /* Room door node border */
    --node-door-radius: 5px;               /* Door node size */

    /* Active Routing Path */
    --route-color: #0055ff;                /* Calculated shortest path color */
    --route-width: 6px;                    /* Route line thickness */
    --animated-dot-fill: #0022aa;          /* Color of moving route dot */

    /* Live GPS Dot */
    --live-dot-color: #28a745;             /* GPS dot and pulse color */

    /* Typography & Labels */
    --map-font-family: Arial, sans-serif;
    --map-text-color: #000033;             /* Label text color */
    --map-text-accent: #3a0ca3;            /* Accent label color */
    --map-text-muted: #666666;             /* Courtyard/secondary text color */
    --room-label-weight: normal;           /* 'normal' (clean) or 'bold' */
    --room-label-size: 11px;               /* Default room label text size */
}
```

---

## 4. Deep-Dive: Styling Every Component

### 4.1 Waypoint Nodes (Corridor Junctions & Door Points)
Waypoint nodes are circular SVG `<circle>` elements created in JavaScript:
- Corridor junction waypoints get class `path-node`.
- Door entrance waypoints get class `door-node`.

#### How to style them in `css/style.css`:
```css
/* Corridor Junction Waypoints */
.path-node {
    fill: #ffffff;               /* Inside color */
    stroke: #ff4d4d;             /* Ring outline color */
    stroke-width: 2px;           /* Ring outline thickness */
    r: 4.5px;                    /* Radius / circle size */
    opacity: 0.7;                /* Transparency */
    transition: r 0.2s ease;
}

/* Enlarge when user hovers over a waypoint */
.path-node:hover {
    r: 7px;
    opacity: 1;
    cursor: pointer;
}

/* Door Entrance Waypoints */
.door-node {
    fill: #ffcc00;               /* Golden yellow fill */
    stroke: #b30000;             /* Dark red outline */
    stroke-width: 2px;
    r: 5px;
    opacity: 0.9;
}

/* To completely hide waypoint dots in production view: */
/* .path-node, .door-node { display: none; } */
```

---

### 4.2 Walkway Edges (Dashed Corridor Lines)
Edges connect nodes that have direct walkable visibility. They are generated in `script.js` as `<line class="path-line">`.

#### How to style them in `css/style.css`:
```css
.path-line {
    fill: none;
    stroke: #6699ff;             /* Edge color */
    stroke-width: 2px;           /* Line thickness */
    stroke-dasharray: 6, 4;      /* 6px stroke, 4px space */
    stroke-linecap: round;       /* Round dashed tips */
    opacity: 0.6;
}

/* To hide the network lines completely so only the floorplan is visible: */
/* .path-line { display: none; } */
```

---

### 4.3 Corridors (Architectural Floor Hallways)
Corridors use a double-stroke technique:
1. `.corridor-base`: A thick dark stroke creating the outer walls.
2. `.corridor-inner`: A slightly thinner light stroke drawn over it, creating the walkable open floor.

#### How to style them in `css/style.css`:
```css
/* Outer Corridor Border */
.corridor-base {
    fill: none;
    stroke: #222222;             /* Wall boundary color */
    stroke-width: 14px;          /* Corridor outer boundary width */
    stroke-linejoin: round;      /* Smooth rounded corridor corners */
    stroke-linecap: round;       /* Smooth rounded end-caps */
}

/* Inner Corridor Floor */
.corridor-inner {
    fill: none;
    stroke: #ffffff;             /* Hallway floor surface color */
    stroke-width: 10px;          /* Walkway passage clearance */
    stroke-linejoin: round;
    stroke-linecap: round;
}
```
> [!TIP]
> The visible wall thickness equals `(corridor-base width - corridor-inner width) / 2`. With `14px` base and `10px` inner, the corridor walls are `(14 - 10) / 2 = 2px` thick on each side.

---

### 4.4 Rooms & Structural Spaces
Rooms are SVG `<rect>`, `<polygon>`, or `<path>` elements.

#### Global Room Borders in `css/style.css`:
```css
/* Container group must have stroke: none so text inside does NOT inherit border stroke */
g.room,
.room {
    stroke: none;
    stroke-width: 0;
}

/* Geometric shapes representing room walls */
.room rect,
.room polygon,
.room path {
    stroke: var(--room-border-stroke, #000000); /* Room partition wall color */
    stroke-width: var(--room-border-width, 2.5px); /* Wall thickness */
    transition: fill 0.2s ease;
}

/* Optional interactive hover effect on rooms */
.room rect:hover,
.room polygon:hover {
    filter: brightness(0.92);
    cursor: pointer;
}
```

> [!CAUTION]
> **Never set `stroke` directly on `.room` or `<g>` containers:**  
> In SVG, `<g>` elements pass their `stroke` down to all children, including `<text>` and `<tspan>`. If `stroke: #000` is applied to `.room`, room names will appear unpleasantly bloated with a thick black inner outline. Always apply wall borders to `.room rect, .room polygon, .room path` specifically.

#### Changing Room Colors:
Room colors are typically set via the `fill="..."` attribute in the respective SVG file (e.g. [`frontend/svg/ground-floor.svg`](file:///E:/vcet_vazhi_kaati/frontend/svg/ground-floor.svg)). You have two ways to edit them:

**Method A: Directly in the SVG file (`frontend/svg/*.svg`)**
Locate the room rectangle and change its `fill` attribute:
```xml
<!-- In frontend/svg/ground-floor.svg -->
<rect x="260" y="95" width="190" height="60" fill="#9bc6ff" />
```

**Method B: In `css/style.css` using CSS Selectors (No SVG editing required)**
You can target any room by its position, class, or existing fill color using standard CSS selectors with `!important` to override SVG presentation attributes:
```css
/* Turn all soft-blue rooms into subtle emerald green */
#campus-map rect[fill="#9bc6ff"] {
    fill: #a7f3d0 !important;
}

/* Turn all purple rooms into amber */
#campus-map rect[fill="#d9bbf9"] {
    fill: #fed7aa !important;
}

/* Target a specific room by coordinates */
#campus-map rect[x="260"][y="95"] {
    fill: #93c5fd !important;
    stroke: #1e3a8a !important;
    stroke-width: 3px !important;
}
```

---

### 4.5 Doors (Physical Door Openings on Walls)
Doors are represented as thin rectangular breaks on walls with class `door-rect`.

#### How to style them in `css/style.css`:
```css
.door-rect {
    fill: #ffffff;               /* Door opening background */
    stroke: #000000;             /* Door threshold frame */
    stroke-width: 2px;
    rx: 2px;                     /* Rounded corners */
}
```

---

### 4.6 Active Navigation Route Path
When a user selects a source and destination and clicks **Navigate**, Dijkstra calculates the shortest path and draws it into `#highlighted-path-${floor}` with class `.route-highlight`.

#### How to style them in `css/style.css`:
```css
.route-highlight {
    fill: none;
    stroke: #0055ff;             /* Route line color */
    stroke-width: 6px;           /* Line width */
    stroke-linecap: round;       /* Rounded ends */
    stroke-linejoin: round;      /* Smooth turns at junctions */
    opacity: 0.85;
    filter: drop-shadow(0 0 4px rgba(0, 85, 255, 0.5)); /* Subtle glowing path */
}
```

#### Animated "Marching Ants" Dashed Route (Optional Effect):
To make the route actively crawl forward toward the destination:
```css
@keyframes marchingAnts {
    from {
        stroke-dashoffset: 40;
    }
    to {
        stroke-dashoffset: 0;
    }
}

.route-highlight {
    stroke-dasharray: 12, 8;
    animation: marchingAnts 1s linear infinite;
}
```

---

### 4.7 Animated Moving Beacon (`#animated-dot`)
This circle moves waypoint-by-waypoint along the route to guide the user.

#### How to style it in `css/style.css`:
```css
#animated-dot {
    fill: #0022aa;               /* Core dot color */
    stroke: #ffffff;             /* Outer white ring */
    stroke-width: 2.5px;
    r: 9px;                      /* Size of moving beacon */
    filter: drop-shadow(0px 0px 8px rgba(0, 102, 255, 0.9)); /* High-visibility glow */
    transition: all 0.1s linear;
}
```

---

### 4.8 Live GPS Location Dot & Pulse Ring
Used by the live GPS tracking feature when the user clicks **📍 Start Live Tracking**.

#### How to style it in `css/style.css`:
```css
/* Center GPS dot */
#live-dot {
    fill: #28a745;               /* Green tracking dot */
    stroke: #ffffff;
    stroke-width: 2px;
    filter: drop-shadow(0px 0px 6px rgba(40, 167, 69, 0.9));
    transition: cx 0.5s ease-out, cy 0.5s ease-out;
}

/* Pulsing radar ripple ring */
#pulse-ring {
    fill: none;
    stroke: #28a745;
    stroke-width: 2px;
    animation: pulse 1.5s infinite ease-out;
    transition: cx 0.5s ease-out, cy 0.5s ease-out;
}

/* Keyframe animation for the expanding ripple */
@keyframes pulse {
    0% {
        r: 8px;
        opacity: 1;
    }
    100% {
        r: 28px;
        opacity: 0;
    }
}
```

---

### 4.9 Text Labels & Typography
Text labels on rooms and corridors use several standard classes:

| Class | Font Size | Weight | Typical Use |
| :--- | :--- | :--- | :--- |
| `.text-main` | `18px` | Bold | Large landmarks (Amphi Theatre, Board Room, Stage) |
| `.text-sm` | `13px` | Bold | Standard laboratories & offices (AI Lab, DS Lab, Reception) |
| `.text-xs` | `11px` | Bold | Small rooms (Restrooms, Cabins, Staircases, Xerox) |
| `.room-label` | `11px` | Bold | Upper floor room numbers & descriptions |
| `.room-label-sm` | `9px` | Bold | Compact room labels with multiple text lines |
| `.room-label-lg` | `13px` | Bold | Large room numbers (e.g. Room 119) |
| `.text-courtyard` | `15px` | Normal | Courtyard center indicator |
| `.direction-text`| `22px` | Bold | Compass badges (North, South, East, West) |

#### How to style text labels in `css/style.css`:
```css
/* All map labels: MUST reset stroke to none so text never inherits thick borders from parent SVG groups */
text,
tspan,
.text-main,
.text-sm,
.text-xs,
.room-label,
.room-label-sm,
.room-label-lg,
.direction-text {
    stroke: none !important;
    stroke-width: 0 !important;
    paint-order: fill;
    font-family: var(--map-font-family);
    fill: var(--map-text-color);
    text-anchor: middle;
    alignment-baseline: middle;
    user-select: none;
    pointer-events: none;
}

/* Room labels styling - controlled via CSS variables or direct rules */
.room-label {
    font-size: var(--room-label-size, 11px);
    font-weight: var(--room-label-weight, normal); /* 'normal' for clean text, 'bold' for heavy */
}

/* Change font size or weight on specific landmark classes */
.text-main { font-size: 18px; font-weight: 800; }
.text-sm   { font-size: 13px; font-weight: 700; }
.text-xs   { font-size: 11px; font-weight: 600; }
```

> [!IMPORTANT]
> **Why SVG text was thick/bold with an inner black stroke:**  
> In SVG, `<text>` and `<tspan>` elements inherit `stroke` and `stroke-width` from any parent container (`<g class="room">`). If `.room { stroke: #000; stroke-width: 2.5px; }` is applied to the group, the browser draws a 2.5px thick black outline around every letter in the font, making it look distorted and bold even without `class="room-label"`.  
> We solved this by:  
> 1. Restricting room strokes strictly to shape elements (`.room rect, .room polygon, .room path`) and setting `stroke: none;` on `g.room`.  
> 2. Adding `stroke: none !important; stroke-width: 0 !important; paint-order: fill;` to all text and tspan selectors in `style.css`.  
> 3. Stripping any internal `<style>` tags in `load-components.js` so that `frontend/css/style.css` is the sole, authoritative source of truth.

---

### 4.10 Direction Badges (North, South, East, West)
These badges reside in [`frontend/components/map-container.html`](file:///E:/vcet_vazhi_kaati/frontend/components/map-container.html#L23-L31) around the campus map perimeter.

#### How to style them in `css/style.css`:
```css
/* Badge container box */
.direction-box {
    fill: #ffffff;               /* Badge background */
    stroke: #000000;             /* Badge border */
    stroke-width: 2px;
    rx: 8px;                     /* Rounded corners */
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}

/* Badge label text */
.direction-text {
    font-family: Arial, sans-serif;
    font-size: 20px;
    font-weight: bold;
    fill: #000000;
    text-anchor: middle;
    alignment-baseline: middle;
}
```

---

### 4.11 Floors & Per-Floor Scoping
Each floor SVG has a distinct root group ID:
- `#floor-G` (Ground Floor)
- `#floor-F1` (First Floor)
- `#floor-F2` (Second Floor)
- `#floor-F3` (Third Floor)
- `#floor-F4` (Fourth Floor)
- `#floor-F5` (Fifth Floor)

You can scope any CSS rule to apply **only to a specific floor** by prefixing the selector:

```css
/* Change corridor color ONLY on Ground Floor */
#floor-G .corridor-inner {
    stroke: #fffbf0;
}

/* Change corridor color ONLY on First Floor */
#floor-F1 .corridor-inner {
    stroke: #f0f7ff;
}

/* Make Ground floor text labels dark navy, but F2 labels charcoal */
#floor-G text { fill: #001f3f; }
#floor-F2 text { fill: #333333; }
```

---

## 5. Step-by-Step Practical Recipes

### Recipe 1: Make Waypoint Nodes Completely Invisible (Clean Map Mode)
If you want users to see only the clean architectural blueprint without red/yellow dots:
Open [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) and add:
```css
.path-node,
.door-node,
.path-line {
    display: none;
}
```

### Recipe 2: Change the Active Route to a High-Contrast Neon Green
Open [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) and edit `:root`:
```css
:root {
    --route-color: #00ff88;
    --animated-dot-fill: #00cc66;
}
```
Or directly on the selector:
```css
.route-highlight {
    stroke: #00ff88;
    stroke-width: 8px;
    filter: drop-shadow(0 0 6px rgba(0, 255, 136, 0.8));
}
```

### Recipe 3: Change Hallway Corridors to Modern Wood / Warm Theme
Open [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css):
```css
:root {
    --corridor-outer-color: #3e2723;   /* Deep brown wood border */
    --corridor-inner-color: #fff8e1;   /* Warm cream interior */
}
```

### Recipe 4: Change Font Across the Entire Map
Open [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css):
```css
:root {
    --map-font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    --map-text-color: #1a202c;
}
```

---

## 6. Rules & Important Gotchas

1. **Always edit [`frontend/css/style.css`](file:///E:/vcet_vazhi_kaati/frontend/css/style.css) for global visual changes**:
   Because `load-components.js` imports floor fragments dynamically, styling inside `style.css` is guaranteed to apply everywhere consistently.
2. **SVG Presentation Attributes vs CSS Specificity**:
   If an SVG element has an inline attribute like `fill="#9bc6ff"`, an external CSS rule like `rect { fill: red; }` will override it. However, if an SVG element has an inline `style="fill: #9bc6ff;"` attribute, you must use `!important` in CSS to override it:
   ```css
   rect { fill: #22c55e !important; }
   ```
3. **Never delete `#animated-dot` or `#highlighted-path-*`**:
   The JavaScript navigation engine in `script.js` directly queries these IDs via `document.getElementById()`. You can change their CSS attributes (`stroke`, `fill`, `opacity`, `display`, etc.), but keep their IDs intact.
4. **Testing Changes in Browser**:
   Because browsers aggressively cache CSS and SVG files, after editing `style.css`, perform a hard refresh in your browser (**Ctrl + F5** or **Cmd + Shift + R**).
5. **SVG Text Stroke Inheritance (The "Inner Black Stroke" Issue)**:
   In SVG, child `<text>` and `<tspan>` elements inherit `stroke` and `stroke-width` from any ancestor `<g>` container. If a group has `stroke: #000; stroke-width: 2.5px`, the text glyphs get drawn with a 2.5px black outline around each letter, which looks bloated and thick regardless of `class="room-label"`.
   - **Resolution applied**: `style.css` applies `stroke: none !important; stroke-width: 0 !important; paint-order: fill;` to all text elements, and `.room` container groups have `stroke: none;`.
6. **Stripped Internal `<style>` Tags**:
   `js/load-components.js` strips any `<style>` tags embedded inside floor SVGs upon import. This ensures legacy/duplicate rules from SVG files cannot override or conflict with `frontend/css/style.css`.
7. **Room Label Customization Checklist**:
   To change room labels across the campus map, adjust these properties in `frontend/css/style.css`:
   - **Weight**: Set `--room-label-weight: normal;` for slim, crisp text, or `'bold'` for heavier text.
   - **Size**: Set `--room-label-size: 11px;` (or whatever size fits best).
   - **Color**: Set `--map-text-color: #000033;`.
   - **All text elements rely purely on `.room-label` and `style.css` without interference.**
