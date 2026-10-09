async function loadFragment(targetSelector, url) {
  const target = document.querySelector(targetSelector);
  if (!target) throw new Error(`Component mount not found: ${targetSelector}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}: HTTP ${response.status}`);
  target.innerHTML = await response.text();
}

async function loadFloorMaps() {
  const mapContent = document.getElementById('map-content');
  if (!mapContent) throw new Error('Missing #map-content in map-container component.');

  const floorFiles = {
    G: 'ground-floor.svg',
    F1: 'first-floor.svg',
    F2: 'second-floor.svg',
    F3: 'third-floor.svg',
    F4: 'fourth-floor.svg',
    F5: 'fifth-floor.svg'
  };

  const fragment = document.createDocumentFragment();

  for (const [floorId, fileName] of Object.entries(floorFiles)) {
    const response = await fetch(`svg/${fileName}`);
    if (!response.ok) throw new Error(`Could not load ${fileName}`);
    const svgText = await response.text();
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const floorGroup = doc.querySelector(`#floor-${floorId}`);
    if (!floorGroup) throw new Error(`SVG does not contain #floor-${floorId}`);

    const imported = document.importNode(floorGroup, true);
    if (floorId !== 'G') imported.setAttribute('display', 'none');
    fragment.appendChild(imported);
  }

  // Insert floor groups before global route/live-location overlays so overlays stay visible.
  mapContent.insertBefore(fragment, mapContent.firstChild);
}

async function loadNavigationScript() {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'js/script.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load js/script.js'));
    document.body.appendChild(script);
  });
}

async function startNavigationApp() {
  try {
    await loadFragment('#ui-panel-mount', 'components/ui-panel.html');
    await Promise.all([
      loadFragment('#source-selector-placeholder', 'components/source-selector.html'),
      loadFragment('#destination-selector-placeholder', 'components/destination-selector.html'),
      loadFragment('#navigation-actions-placeholder', 'components/navigation-actions.html'),
      loadFragment('#status-placeholder', 'components/status.html')
    ]);

    await loadFragment('#map-wrapper-mount', 'components/map-wrapper.html');
    await Promise.all([
      loadFragment('#floor-picker-placeholder', 'components/floor-picker.html'),
      loadFragment('#map-container-placeholder', 'components/map-container.html')
    ]);

    await loadFloorMaps();
    await loadNavigationScript();
  } catch (error) {
    console.error('VCET Navigation failed to initialize:', error);
    const mount = document.getElementById('app-load-error');
    if (mount) {
      mount.hidden = false;
      mount.textContent = `The navigation app could not load: ${error.message}. Run this project with VS Code Live Server or another local HTTP server.`;
    }
  }
}

startNavigationApp();
