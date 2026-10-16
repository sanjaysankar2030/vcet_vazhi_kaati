# VCET Navigation - React.js Porting Guide

A comprehensive, step-by-step architectural guide to migrating the VCET indoor navigation codebase from vanilla HTML/CSS/JavaScript to **React.js**.

---

## 1. Overview & Architectural Goals

The current application relies on:
- Dynamic HTML fragment loading via `fetch()` and `target.innerHTML` (`load-components.js`).
- Manual SVG parsing and XML document fragment injection into `#map-content`.
- Direct DOM manipulation (`document.getElementById`, `setAttribute`, `classList`).
- Global state variables (`window.panZoom`, `currentFloor`, `liveWatchId`, `currentAnimation`).
- External CDN dependencies (`svg-pan-zoom`, `hammerjs`).

### Target React Architecture
- **Tooling:** Vite + React (Fast build, modern ES modules, clean SVG support via `vite-plugin-svgr`).
- **Pan & Zoom:** Modern React pan/zoom engine (`react-zoom-pan-pinch`), removing the need for external Hammer.js touch configurations.
- **State Management:** Unidirectional data flow using React hooks (`useState`, `useEffect`, custom hooks).
- **Decoupled Data:** Static graph representations (nodes, edges, coordinate mappings) isolated as pure ES modules.

---

## 2. Recommended Directory Structure

```text
vcet-navigation-react/
├── index.html
├── package.json
├── vite.config.js
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   │
│   ├── assets/
│   │   └── svg/
│   │       ├── ground-floor.svg
│   │       ├── first-floor.svg
│   │       ├── second-floor.svg
│   │       ├── third-floor.svg
│   │       ├── fourth-floor.svg
│   │       └── fifth-floor.svg
│   │
│   ├── data/
│   │   ├── graphNodes.js         # nodes (x, y, floor, lat, lon)
│   │   ├── graphEdges.js         # corridor and door connections
│   │   ├── locationMap.js        # room/facility key to node ID mappings
│   │   └── categories.js         # dropdown options grouped by category
│   │
│   ├── utils/
│   │   ├── dijkstra.js           # findShortestPath algorithm
│   │   └── geoUtils.js           # GPS distance and coordinate snapping logic
│   │
│   ├── hooks/
│   │   ├── useNavigation.js      # routing, floor switching & animation state
│   │   └── useLiveLocation.js    # navigator.geolocation tracking hook
│   │
│   ├── components/
│   │   ├── FloorPicker.jsx       # G, F1, F2, F3, F4, F5 buttons
│   │   ├── NavigationPanel.jsx   # Source & Destination dropdowns + trigger buttons
│   │   ├── StatusBanner.jsx      # route text and arrival announcements
│   │   └── MapViewer.jsx         # SVG viewport, pan/zoom layer, paths, and dots
│   │
│   └── styles/
│       └── style.css             # ported CSS with SVG room styling
```

---

## 3. Setup & Dependencies

Initialize the project with Vite:

```bash
npm create vite@latest vcet-navigation-react -- --template react
cd vcet-navigation-react
npm install
npm install react-zoom-pan-pinch
npm install vite-plugin-svgr -D
```

Configure `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
});
```

---

## 4. Porting Modules & Logic

### 4.1 Data Extraction (`src/data/`)

#### `src/data/graphNodes.js`
```javascript
export const nodes = {
  // Ground Floor
  C_Top_Left: { x: 200, y: 165, floor: "G" },
  C_Top_Right: { x: 1010, y: 165, floor: "G" },
  C_Bot_Left: { x: 200, y: 675, floor: "G" },
  C_Bot_Right: { x: 1010, y: 675, floor: "G" },
  D_Elec: { x: 210, y: 155, floor: "G" },
  // ... all remaining nodes from script.js
};
```

#### `src/data/graphEdges.js`
```javascript
export const edges = [
  ["C_Elec", "C_Top_Left"],
  ["C_Elec", "C_Top_Weave"],
  ["D_SDC", "C_SDC"],
  // ... all remaining edges from script.js
];
```

#### `src/data/locationMap.js`
```javascript
export const locationMap = {
  MainEntrance: "D_MainEntNew",
  Reception: "D_RecptNew",
  XeroxCenter: "D_Xerox",
  // ... all dropdown locations
};
```

---

### 4.2 Pathfinding Algorithm (`src/utils/dijkstra.js`)

Pure JavaScript function free of DOM dependencies:

```javascript
export function findShortestPath(startNode, endNode, nodes, edges) {
  const distances = {};
  const prev = {};
  const queue = [];

  for (const v in nodes) {
    distances[v] = Infinity;
    prev[v] = null;
    queue.push(v);
  }
  distances[startNode] = 0;

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift();
    if (u === endNode) break;

    edges.forEach((edge) => {
      if (edge.includes(u)) {
        const neighbor = edge[0] === u ? edge[1] : edge[0];
        if (queue.includes(neighbor)) {
          const isInterFloor = nodes[u].floor !== nodes[neighbor].floor;
          const dist = isInterFloor
            ? 500
            : Math.hypot(
                nodes[u].x - nodes[neighbor].x,
                nodes[u].y - nodes[neighbor].y
              );

          if (distances[u] + dist < distances[neighbor]) {
            distances[neighbor] = distances[u] + dist;
            prev[neighbor] = u;
          }
        }
      }
    });
  }

  const path = [];
  let u = endNode;
  while (prev[u]) {
    path.unshift(u);
    u = prev[u];
  }
  if (path.length > 0) path.unshift(startNode);
  return path;
}
```

---

### 4.3 Navigation Hook (`src/hooks/useNavigation.js`)

Manages calculated floor paths and node-by-node animation:

```javascript
import { useState, useRef, useEffect } from 'react';
import { nodes } from '../data/graphNodes';
import { edges } from '../data/graphEdges';
import { locationMap } from '../data/locationMap';
import { findShortestPath } from '../utils/dijkstra';

export function useNavigation(currentFloor, setCurrentFloor) {
  const [activePaths, setActivePaths] = useState({
    G: '', F1: '', F2: '', F3: '', F4: '', F5: ''
  });
  const [dotPos, setDotPos] = useState(null); // { x, y, floor }
  const [status, setStatus] = useState('');
  const animationTimerRef = useRef(null);

  // Clear animation on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  const clearRoute = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setActivePaths({ G: '', F1: '', F2: '', F3: '', F4: '', F5: '' });
    setDotPos(null);
    setStatus('');
  };

  const startNavigation = (sourceKey, destKey, destLabel) => {
    clearRoute();

    const startNode = locationMap[sourceKey];
    const endNode = locationMap[destKey];

    if (!startNode || !endNode) {
      setStatus('Invalid start or destination location.');
      return;
    }

    if (startNode === endNode) {
      setStatus('Already at destination.');
      return;
    }

    const pathNodes = findShortestPath(startNode, endNode, nodes, edges);
    if (!pathNodes.length) {
      setStatus('No valid route found.');
      return;
    }

    // Build SVG path strings per floor ("M x y L x y ...")
    const pathsByFloor = { G: '', F1: '', F2: '', F3: '', F4: '', F5: '' };
    let prevPt = null;

    pathNodes.forEach((nodeId) => {
      const pt = nodes[nodeId];
      if (!prevPt || prevPt.floor !== pt.floor) {
        pathsByFloor[pt.floor] += `M ${pt.x} ${pt.y} `;
      } else {
        pathsByFloor[pt.floor] += `L ${pt.x} ${pt.y} `;
      }
      prevPt = pt;
    });

    setActivePaths(pathsByFloor);

    // Automatically change to start floor
    const startFloor = nodes[pathNodes[0]].floor;
    if (currentFloor !== startFloor) {
      setCurrentFloor(startFloor);
    }

    // Node-by-node dot animation
    let step = 0;
    const endFloor = nodes[pathNodes[pathNodes.length - 1]].floor;
    setStatus(`Routing smoothly to ${destLabel}...`);

    animationTimerRef.current = setInterval(() => {
      step++;
      if (step >= pathNodes.length) {
        clearInterval(animationTimerRef.current);
        if (currentFloor !== endFloor) {
          setCurrentFloor(endFloor);
        }
        setStatus(`Arrived at ${destLabel}!`);
        return;
      }

      const target = nodes[pathNodes[step]];
      if (target.floor !== currentFloor) {
        setCurrentFloor(target.floor);
        setStatus(`Switched to ${target.floor === 'G' ? 'Ground Floor' : 'Floor ' + target.floor.replace('F', '')}...`);
      }

      setDotPos({ x: target.x, y: target.y, floor: target.floor });
    }, 300);
  };

  return { activePaths, dotPos, status, startNavigation, clearRoute };
}
```

---

### 4.4 Live Geolocation Hook (`src/hooks/useLiveLocation.js`)

Snaps coordinates using hysteresis to prevent jitter:

```javascript
import { useState, useRef, useEffect } from 'react';
import { nodes } from '../data/graphNodes';
import { getDistance } from '../utils/geoUtils';

export function useLiveLocation(currentFloor) {
  const [isTracking, setIsTracking] = useState(false);
  const [liveDot, setLiveDot] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');

  const watchIdRef = useRef(null);
  const candidateNodeRef = useRef(null);
  const candidateCountRef = useRef(0);
  const activeSnappedNodeRef = useRef(null);

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setLiveDot(null);
    setGeoStatus('Live tracking stopped.');
  };

  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);
    setGeoStatus('Searching for nearest node...');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        let closestNode = null;
        let minDist = Infinity;

        for (const key in nodes) {
          if (nodes[key].floor === currentFloor && nodes[key].lat) {
            const dist = getDistance(lat, lon, nodes[key].lat, nodes[key].lon);
            if (dist < minDist) {
              minDist = dist;
              closestNode = key;
            }
          }
        }

        if (closestNode === candidateNodeRef.current) {
          candidateCountRef.current++;
        } else {
          candidateNodeRef.current = closestNode;
          candidateCountRef.current = 1;
        }

        if (candidateCountRef.current >= 3 || activeSnappedNodeRef.current === null) {
          if (activeSnappedNodeRef.current !== closestNode && closestNode) {
            activeSnappedNodeRef.current = closestNode;
            const pt = nodes[closestNode];
            setLiveDot({ x: pt.x, y: pt.y });
            setGeoStatus(`Live: Snapped near ${closestNode}`);
          }
        }
      },
      (error) => {
        alert('GPS Error: ' + error.message);
        stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { isTracking, liveDot, geoStatus, startTracking, stopTracking };
}
```

---

### 4.5 Map Viewer Component (`src/components/MapViewer.jsx`)

Replaces manual pan-zoom bindings with declarative SVG rendering:

```jsx
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function MapViewer({
  currentFloor,
  activePaths,
  dotPos,
  liveDot,
  FloorComponent
}) {
  return (
    <div id="map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit
        limitToBounds={false}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <svg
            id="campus-map"
            viewBox="0 0 1200 900"
            width="1200"
            height="900"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <g id="map-content">
              {/* Active Floor Plan SVG */}
              {FloorComponent && <FloorComponent />}

              {/* Cardinal Directions */}
              <rect className="direction-box" x="540" y="30" width="120" height="40" />
              <text x="600" y="57" className="direction-text">South</text>
              <rect className="direction-box" x="540" y="830" width="120" height="40" />
              <text x="600" y="857" className="direction-text">North</text>
              <rect className="direction-box" x="30" y="410" width="40" height="100" />
              <text x="57" y="460" className="direction-text" transform="rotate(-90 57 460)">East</text>
              <rect className="direction-box" x="1130" y="410" width="40" height="100" />
              <text x="1157" y="460" className="direction-text" transform="rotate(90 1157 460)">West</text>

              {/* Highlighted Navigation Path */}
              {activePaths[currentFloor] && (
                <path
                  id={`highlighted-path-${currentFloor}`}
                  d={activePaths[currentFloor]}
                  fill="none"
                  stroke="#ff5722"
                  strokeWidth="5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />
              )}

              {/* Animated Route Dot */}
              {dotPos && dotPos.floor === currentFloor && (
                <circle
                  id="animated-dot"
                  cx={dotPos.x}
                  cy={dotPos.y}
                  r="10"
                  fill="#ff9800"
                />
              )}

              {/* Live Geolocation Tracker */}
              {liveDot && (
                <g id="live-user-group">
                  <circle id="pulse-ring" cx={liveDot.x} cy={liveDot.y} r="15" />
                  <circle id="live-dot" cx={liveDot.x} cy={liveDot.y} r="8" fill="#28a745" />
                </g>
              )}
            </g>
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
```

---

### 4.6 Floor Picker Component (`src/components/FloorPicker.jsx`)

```jsx
import React from 'react';

const FLOORS = [
  { id: 'G', label: 'Ground Floor' },
  { id: 'F1', label: '1st Floor' },
  { id: 'F2', label: '2nd Floor' },
  { id: 'F3', label: '3rd Floor' },
  { id: 'F4', label: '4th Floor' },
  { id: 'F5', label: '5th Floor' },
];

export default function FloorPicker({ currentFloor, onSelectFloor }) {
  return (
    <div className="floor-picker-container">
      {FLOORS.map((f) => (
        <button
          key={f.id}
          className={`floor-btn ${currentFloor === f.id ? 'active' : ''}`}
          onClick={() => onSelectFloor(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
```

---

### 4.7 Main Application (`src/App.jsx`)

```jsx
import React, { useState } from 'react';
import FloorPicker from './components/FloorPicker';
import NavigationPanel from './components/NavigationPanel';
import MapViewer from './components/MapViewer';
import { useNavigation } from './hooks/useNavigation';
import { useLiveLocation } from './hooks/useLiveLocation';

// Import floor SVGs via vite-plugin-svgr
import GroundFloor from './assets/svg/ground-floor.svg?react';
import FirstFloor from './assets/svg/first-floor.svg?react';
import SecondFloor from './assets/svg/second-floor.svg?react';
import ThirdFloor from './assets/svg/third-floor.svg?react';
import FourthFloor from './assets/svg/fourth-floor.svg?react';
import FifthFloor from './assets/svg/fifth-floor.svg?react';

const FLOOR_SVGS = {
  G: GroundFloor,
  F1: FirstFloor,
  F2: SecondFloor,
  F3: ThirdFloor,
  F4: FourthFloor,
  F5: FifthFloor,
};

export default function App() {
  const [currentFloor, setCurrentFloor] = useState('G');
  const [source, setSource] = useState('MainEntrance');
  const [destination, setDestination] = useState('Reception');

  const { activePaths, dotPos, status, startNavigation } = useNavigation(
    currentFloor,
    setCurrentFloor
  );

  const { isTracking, liveDot, geoStatus, startTracking, stopTracking } =
    useLiveLocation(currentFloor);

  return (
    <div className="app-container">
      <div id="ui-panel">
        <NavigationPanel
          source={source}
          destination={destination}
          onSourceChange={setSource}
          onDestinationChange={setDestination}
          onNavigate={(destLabel) => startNavigation(source, destination, destLabel)}
          isTracking={isTracking}
          onToggleTracking={isTracking ? stopTracking : startTracking}
          status={status || geoStatus}
        />
      </div>

      <div id="map-wrapper">
        <FloorPicker
          currentFloor={currentFloor}
          onSelectFloor={setCurrentFloor}
        />
        <MapViewer
          currentFloor={currentFloor}
          activePaths={activePaths}
          dotPos={dotPos}
          liveDot={liveDot}
          FloorComponent={FLOOR_SVGS[currentFloor]}
        />
      </div>
    </div>
  );
}
```

---

## 5. Migration Checklist

1. [ ] **Copy SVG assets:** Transfer files from `frontend/svg/` to `src/assets/svg/`. Ensure any embedded `<style>` tags are removed so central CSS styling applies consistently.
2. [ ] **Extract Data:** Move `nodes`, `edges`, and `locationMap` from `frontend/js/script.js` to `src/data/`.
3. [ ] **Copy CSS:** Port `frontend/css/style.css` directly to `src/styles/style.css` and import it into `src/main.jsx`.
4. [ ] **Replace Pan-Zoom:** Replace `svg-pan-zoom` + `hammerjs` with `<TransformWrapper>` from `react-zoom-pan-pinch`.
5. [ ] **Verify Auto-Floor Switching:** Test multi-floor routes (e.g. Ground Floor to 2nd Floor) to confirm the active floor switches automatically as the dot advances past staircase nodes.
