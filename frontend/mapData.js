/**
 * VCET MAP CONFIGURATION (mapData.js)
 * =============================================================================
 * Rooms, structural rects and the original waypoint nodes are verified
 * against design.svg — coordinates match its transforms exactly.
 *
 * MAP_EDGES is back to plain ['A','B'] tuples — map-engine.js destructures
 * edges as [fromId, toId] and Dijkstra reads edge[0]/edge[1]/edge.includes(),
 * so that's the only format it understands. There is no `path` field
 * anywhere in the engine.
 *
 * Corridor bends (so paths don't cut through Electrical Cabin, Amphi
 * Theatre, Board Room, etc.) are represented the same way the old working
 * file did it: each bend is a real node (prefixed J_) sitting on the actual
 * corridor centerline read off the blue dashed lines in design.svg, wired
 * in with ordinary tuple edges. The renderer and Dijkstra need no changes.
 * =============================================================================
 */

// =============================================================================
// 1. ROOM RECTANGLES CONFIGURATION (verified against design.svg)
// -----------------------------------------------------------------------------
const MAP_ROOMS = [
    // --- Top Wing ---
    {
        id: 'ElectricalCabin',
        name: 'Electrical Cabin',
        lines: ['Electrical', 'Cabin'],
        x: 215, y: 269.3, width: 61.9, height: 56.5,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'TL_Corner'
    },
    {
        id: 'AILab',
        name: 'AI Laboratory',
        lines: ['AI Laboratory'],
        x: 305.7, y: 204.1, width: 178.8, height: 56.5,
        fill: '#9bc6ff', textClass: 'text-sm',
        node: 'N_Top_AI'
    },
    {
        id: 'DSLab',
        name: 'DS Laboratory',
        lines: ['DS Laboratory'],
        x: 487.6, y: 206, width: 158.3, height: 56.5,
        fill: '#9bc6ff', textClass: 'text-sm',
        node: 'N_Top_DS'
    },
    {
        id: 'CoreSpace',
        name: 'Core Space',
        lines: ['Core Space'],
        x: 654.9, y: 206, width: 277.6, height: 56.5,
        fill: '#d9bbf9', textClass: 'text-sm',
        node: 'N_Top_Core'
    },
    {
        id: 'YuvarajSir',
        name: 'Yuvaraj Sir Cabin',
        lines: ['Yuvaraj', 'Sir Cabin'],
        x: 941.9, y: 206, width: 56.5, height: 56.5,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'TR_Corner'
    },

    // --- Left Wing ---
    {
        id: 'CDCHall',
        name: 'CDC Hall',
        lines: ['CDC Hall'],
        x: 126.1, y: 267.4, width: 83.7, height: 65.9,
        fill: '#ffb3cc', textClass: 'text-sm',
        node: 'N_Left_CDC'
    },
    {
        id: 'StudentRestEast',
        name: 'Student Rest Room (East)',
        lines: ['Student', 'Rest Room'],
        x: 61.7, y: 278.5, width: 63.3, height: 82.7,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Left_AIDS_B'
    },
    {
        id: 'AIDS_B',
        name: '2nd Year AI-DS B',
        lines: ['2nd Year', 'AI-DS B'],
        x: 62.1, y: 370.4, width: 84.7, height: 102.8,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_AIDS_B'
    },
    {
        id: 'AIDS_A',
        name: '2nd Year AI-DS A',
        lines: ['2nd Year', 'AI-DS A'],
        x: 62.1, y: 483.5, width: 84.7, height: 61.2,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_Stage'
    },
    {
        id: 'CSEC',
        name: '2nd Year CSE-C',
        lines: ['2nd Year', 'CSE-C'],
        x: 62.1, y: 554.1, width: 84.7, height: 61.2,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_CSEC'
    },
    {
        id: 'LiftEast',
        name: 'Lift (East)',
        lines: ['Lift'],
        x: 62.1, y: 624.7, width: 65.9, height: 47,
        fill: '#c6a1f9', textClass: 'text-sm',
        node: 'N_Left_Board'
    },
    {
        id: 'StaircaseEast',
        name: 'Staircase (East)',
        lines: ['Staircase'],
        x: 62.1, y: 681.1, width: 75.3, height: 51.7,
        fill: '#e0e0e0', textClass: 'text-xs',
        node: 'N_Left_Board'
    },
    {
        id: 'NewBuilding',
        name: 'New Building',
        lines: ['New', 'Building'],
        x: 63.9, y: 754.6, width: 84.7, height: 75.3,
        fill: '#ffb3cc', textClass: 'text-xs',
        node: 'BL_Corner'
    },

    // --- Right Wing ---
    {
        id: 'SDCHall',
        name: 'SDC Hall',
        lines: ['SDC', 'Hall'],
        isPolygon: true,
        points: '970.1,271.8 1012.4,271.8 1012.4,384.7 937.1,384.7 937.1,304.8',
        textX: 974.8, textY: 343.3,
        fill: '#a0f4a0', textClass: 'text-sm',
        node: 'N_Right_SDC'
    },
    {
        id: 'LiftWest',
        name: 'Lift (West)',
        lines: ['Lift'],
        x: 946.6, y: 394.2, width: 65.9, height: 47,
        fill: '#c6a1f9', textClass: 'text-sm',
        node: 'N_Right_Lift'
    },
    {
        id: 'StudentRestWest',
        name: 'Student Rest Room (West)',
        lines: ['Student', 'Rest Room'],
        x: 937.1, y: 450.6, width: 75.3, height: 61.2,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Right_Sec'
    },
    {
        id: 'SecondEntrance',
        name: 'Second Entrance',
        lines: ['Second', 'Entrance'],
        x: 946.6, y: 521.2, width: 65.9, height: 51.7,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'N_Right_Sec'
    },
    {
        id: 'StaircaseWest',
        name: 'Staircase (West)',
        lines: ['Staircase'],
        x: 946.6, y: 582.3, width: 65.9, height: 47,
        fill: '#e0e0e0', textClass: 'text-xs',
        node: 'N_Right_Stair'
    },
    {
        id: 'PrincipalRoom',
        name: 'Principal Room',
        lines: ['Principal', 'Room'],
        x: 937.1, y: 638.8, width: 75.3, height: 75.3,
        fill: '#d9bbf9', textClass: 'text-xs',
        node: 'N_Right_Princ'
    },
    {
        id: 'StaffRestRoom',
        name: 'Staff Rest Room',
        lines: ['Staff', 'Rest Room'],
        x: 946.6, y: 723.5, width: 65.9, height: 94.1,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Right_Staff'
    },

    // --- Bottom Wing ---
    {
        id: 'KnowledgeHub',
        name: 'Knowledge Hub',
        lines: ['Knowledge Hub'],
        x: 157.9, y: 773.4, width: 108.2, height: 56.5,
        fill: '#d9bbf9', textClass: 'text-xs',
        node: 'N_Bot_Know'
    },
    {
        id: 'MathLab',
        name: 'Math Lab',
        lines: ['Math Lab'],
        x: 275.6, y: 773.4, width: 75.3, height: 56.5,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Math'
    },
    {
        id: 'Library',
        name: 'Library',
        lines: ['Library'],
        x: 360.2, y: 773.4, width: 98.8, height: 56.5,
        fill: '#a0f4a0', textClass: 'text-xs',
        node: 'N_Bot_Lib'
    },
    {
        id: 'XeroxShop',
        name: 'Xerox Shop',
        lines: ['Xerox shop'],
        x: 483, y: 711.5, width: 117.5, height: 15,
        fill: '#c3b2f0', textClass: 'text-xs',
        node: 'N_Recpt_Door'
    },
    {
        id: 'Reception',
        name: 'Reception',
        lines: ['Reception'],
        x: 484.3, y: 763.5, width: 112.9, height: 17.3,
        fill: '#ffb3cc', textClass: 'text-xs',
        node: 'N_Recpt_Door'
    },
    {
        id: 'MainEntrance',
        name: 'Main Entrance',
        lines: ['Main Entrance'],
        x: 480.8, y: 784.7, width: 112.9, height: 52.1,
        fill: '#ffffff', textClass: 'text-sm',
        node: 'N_Recpt_Hall'
    },
    {
        id: 'CashCounter',
        name: 'Cash Counter',
        lines: ['Cash Counter'],
        x: 633.1, y: 773.4, width: 89.4, height: 56.5,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Cash'
    },
    {
        id: 'AdmissionCentre',
        name: 'Admission Centre',
        lines: ['Admission', 'Centre'],
        x: 731.9, y: 773.4, width: 94.1, height: 56.5,
        fill: '#a0f4a0', textClass: 'text-xs',
        node: 'N_Bot_Admin'
    },
    {
        id: 'ScholarshipCounter',
        name: 'Scholarship Counter',
        lines: ['Scholarship', 'Counter'],
        x: 835.4, y: 773.4, width: 94.1, height: 56.5,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'BR_Corner'
    },

    // --- Center Blocks ---
    {
        id: 'AmphiTheatre',
        name: 'Amphi Theatre',
        lines: ['Amphi Theatre'],
        x: 359.8, y: 285.1, width: 247.6, height: 127,
        fill: '#fde4a7', textClass: 'text-main',
        node: 'N_Courtyard_Center'
    },
    {
        id: 'ViscomHall',
        name: 'Viscom Hall',
        lines: ['Viscom', 'Hall'],
        x: 645.5, y: 281.2, width: 155.2, height: 127,
        fill: '#ffb3cc', textClass: 'text-main',
        textColor: '#3a0ca3',
        node: 'N_Top_Mid'
    },
    {
        id: 'Stage',
        name: 'Stage',
        lines: ['Stage'],
        x: 189.1, y: 445.9, width: 112.9, height: 103.5,
        fill: '#ffb3cc', textClass: 'text-main',
        textColor: '#3a0ca3',
        node: 'N_Left_Stage'
    },
    {
        id: 'BoardRoom',
        name: 'Board Room',
        lines: ['Board Room'],
        x: 179.7, y: 605.9, width: 145.8, height: 136.4,
        fill: '#a0f4a0', textClass: 'text-main',
        node: 'N_Board_Stage'
    },
    {
        id: 'IdeaHub',
        name: 'Idea Hub',
        lines: ['Idea Hub'],
        x: 335, y: 615.3, width: 65.9, height: 84.7,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Math'
    }
];

// =============================================================================
// 2. STRUCTURAL RECTANGLES & ELEMENTS (verified against design.svg)
// -----------------------------------------------------------------------------
const STRUCTURAL_RECTS = [
    { id: 'wall-outer', x: 48, y: 191.9, width: 978.5, height: 696.3, class: 'wall' },
    { id: 'corridor-outer', x: 62.6, y: 214.4, width: 940.9, height: 658.6, class: 'corridor' },

    { id: 'wall-center', x: 435.3, y: 441, width: 207, height: 263.5, class: 'wall' },
    { id: 'corridor-center', x: 444.7, y: 450.4, width: 188.2, height: 244.6, class: 'corridor' },

    { id: 'grass-east-top', x: 682, y: 419.2, width: 169.4, height: 77, fill: '#73d936', stroke: '#000000', strokeWidth: 2 },
    { id: 'grass-east-border', x: 669, y: 532.6, width: 188.2, height: 183.4, fill: '#000000' },
    { id: 'grass-east', x: 678.4, y: 537.4, width: 169.4, height: 172.3, fill: '#73d936', stroke: '#000000', strokeWidth: 2 },

    { id: 'grass-west-border', x: 311.4, y: 445.9, width: 84.7, height: 141.1, fill: '#000000' },
    { id: 'grass-west', x: 320.9, y: 455.3, width: 65.9, height: 122.3, fill: '#73d936', stroke: '#000000', strokeWidth: 2 },

    { id: 'obstacle-top-left', x: 193.2, y: 369.6, width: 143.6, height: 42.3, fill: '#73d936', stroke: '#000000', strokeWidth: 3 },
    { id: 'obstacle-mid-right', x: 814.8, y: 304.8, width: 51.7, height: 65.9, fill: '#e0e0e0', stroke: '#000000', strokeWidth: 3 },

    { id: 'entrance-frame', x: 443.2, y: 836.4, width: 188.2, height: 37.6, fill: 'none' }
];

const DECORATIVE_CIRCLES = [
    { cx: 537.3, cy: 568.2, r: 28.2, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 2 },
    { cx: 537.3, cy: 568.2, r: 18.8, fill: '#a0c4ff', stroke: '#000000', strokeWidth: 2 },
    { cx: 537.3, cy: 568.2, r: 9.4, fill: '#f4e04d', stroke: '#000000', strokeWidth: 1 },

    { cx: 765.6, cy: 583.9, r: 18.8, fill: '#2d6a4f', stroke: '#000000', strokeWidth: 2 },
    { cx: 789.4, cy: 596.8, r: 14.1, fill: '#1b4332', stroke: '#000000', strokeWidth: 2 },
    { cx: 706.6, cy: 662.3, r: 18.8, fill: '#2d6a4f', stroke: '#000000', strokeWidth: 2 },
    { cx: 734.9, cy: 681.1, r: 16.9, fill: '#1b4332', stroke: '#000000', strokeWidth: 2 },
    { cx: 721.4, cy: 455.7, r: 14.1, fill: '#1b4332', stroke: '#000000', strokeWidth: 2 },
    { cx: 778.1, cy: 454.8, r: 18.8, fill: '#2d6a4f', stroke: '#000000', strokeWidth: 2 },

    { cx: 230.8, cy: 394, r: 13, fill: '#ff0000' },
    { cx: 304.5, cy: 391.9, r: 15, fill: '#ff0000' }
];

const DECORATIVE_LINES = [
    { x1: 462, y1: 845.8, x2: 612.5, y2: 845.8, stroke: '#000000', strokeWidth: 2 },
    { x1: 462, y1: 859.9, x2: 612.5, y2: 859.9, stroke: '#000000', strokeWidth: 2 }
];

const DIRECTION_MARKERS = [
    { label: 'South', x: 480.8, y: 144.8, width: 112.9, height: 37.6, textX: 537.3, textY: 163.7, rotate: null },
    { label: 'North', x: 480.8, y: 897.5, width: 112.9, height: 37.6, textX: 537.3, textY: 916.5, rotate: null },
    { label: 'East', x: 0.9, y: 502.4, width: 37.6, height: 94.1, textX: 19.9, textY: 549.4, rotate: -90 },
    { label: 'West', x: 1036.1, y: 502.4, width: 43.8, height: 94.1, textX: 1067.8, textY: 549.4, rotate: 90 }
];

// =============================================================================
// 3. NAVIGATION NODES (WAYPOINTS)
// -----------------------------------------------------------------------------
// Original waypoints match the SVG's red circle markers exactly. J_ prefixed
// nodes are new — they are the real corridor bend points (read off the blue
// dashed lines in design.svg) that make the routed path avoid walls/rooms.
// =============================================================================
const MAP_NODES = {
    // Reception & Bottom Wing
    'N_Recpt_Door':        { x: 537.3, y: 737.6, label: 'Reception / Xerox Door' },
    'N_Recpt_Hall':        { x: 537.3, y: 756.4, label: 'Main Entrance Hallway' },
    'N_Bot_Lib':           { x: 414.9, y: 756.4, label: 'Library Junction' },
    'N_Bot_Math':          { x: 316.1, y: 756.4, label: 'Math Lab Junction' },
    'N_Bot_Know':          { x: 236.2, y: 756.4, label: 'Knowledge Hub Junction' },
    'BL_Corner':           { x: 160.9, y: 756.4, label: 'Bottom-Left Corner (New Building)' },
    'N_Bot_Cash':          { x: 664.3, y: 756.4, label: 'Cash Counter Junction' },
    'N_Bot_Admin':         { x: 791.3, y: 756.4, label: 'Admission Centre Junction' },
    'BR_Corner':           { x: 913.6, y: 756.4, label: 'Bottom-Right Corner (Scholarship)' },

    // Left Wing
    'N_Left_Board':        { x: 160.9, y: 634.1, label: 'Staircase / Lift East' },
    'N_Left_CSEC':         { x: 160.9, y: 540.0, label: '2nd Year CSE-C Junction' },
    'N_Left_Stage':        { x: 160.9, y: 445.9, label: 'Stage / AI-DS A Junction' },
    'N_Left_AIDS_B':       { x: 125.4, y: 349.2, label: '2nd Year AI-DS B Doorway' },
    'N_Left_CDC':          { x: 160.9, y: 342.4, label: 'CDC Hall Junction' },
    'TL_Corner':           { x: 250.3, y: 337.7, label: 'Top-Left Corner (Electrical Cabin)' },

    // Top Wing
    'N_Top_AI':            { x: 414.9, y: 271.8, label: 'AI Laboratory Junction' },
    'N_Top_DS':            { x: 537.3, y: 271.8, label: 'DS Laboratory Junction' },
    'N_Top_Mid':           { x: 664.3, y: 271.8, label: 'Viscom Hall Junction' },
    'N_Top_Core':          { x: 796.0, y: 271.8, label: 'Core Space Junction' },
    'TR_Corner':           { x: 913.6, y: 271.8, label: 'Top-Right Corner (Yuvaraj Cabin)' },

    // Right Wing
    'N_Right_SDC':         { x: 913.6, y: 328.3, label: 'SDC Hall Junction' },
    'N_Right_Lift':        { x: 913.6, y: 413.0, label: 'Right Lift Junction' },
    'N_Right_Sec':         { x: 913.6, y: 483.5, label: 'Second Entrance / Rest Room' },
    'N_Right_Stair':       { x: 913.6, y: 549.4, label: 'Right Staircase Junction' },
    'N_Right_Princ':       { x: 913.6, y: 624.7, label: 'Principal Room Junction' },
    'N_Right_Staff':       { x: 913.6, y: 690.5, label: 'Staff Rest Room Junction' },

    // Central hubs
    'N_Courtyard_Center':  { x: 526.4, y: 425.5, label: 'Courtyard Central Crossway' },
    'N_Board_Stage':       { x: 249.1, y: 551.4, label: 'Stage / Board Room Inner' },

    // --- Corridor bend nodes (new) ---
    // CDC Hall -> Top-Left Corner dogleg
    'J_CDC1':  { x: 175,   y: 342.4, label: 'Corridor Bend' },
    'J_CDC2':  { x: 175,   y: 361.2, label: 'Corridor Bend' },
    'J_CDC3':  { x: 250.3, y: 361.2, label: 'Corridor Bend' },

    // Top-Left Corner -> AI Lab, around Electrical Cabin
    'J_TL1':   { x: 292.6, y: 337.7, label: 'Corridor Bend' },
    'J_TL2':   { x: 292.6, y: 271.8, label: 'Corridor Bend' },

    // West side of courtyard ring (shared junction into N_Courtyard_Center)
    'J_CY_W1': { x: 416,   y: 719.4, label: 'Corridor Bend' },
    'J_CY_W2': { x: 413,   y: 427.5, label: 'Courtyard Ring Junction (West)' },

    // East side of courtyard ring (shared junction into N_Courtyard_Center)
    'J_CY_E1': { x: 657,   y: 717,   label: 'Corridor Bend' },
    'J_CY_E2': { x: 657,   y: 427,   label: 'Courtyard Ring Junction (East)' },
    'J_CY_S1': { x: 909,   y: 514,   label: 'Corridor Bend' },
    'J_CY_S2': { x: 657,   y: 514,   label: 'Corridor Bend' },

    // Stage -> courtyard, past the obstacle block

    // Board Room inner path
    'J_BOARD2': { x: 238.8, y: 591.6, label: 'Corridor Bend' },
    'J_BOARD3': { x: 410,   y: 600.6, label: 'Corridor Bend' },
};

// =============================================================================
// 4. NAVIGATION EDGES (CONNECTIONS)
// -----------------------------------------------------------------------------
// Plain ['A','B'] tuples only — this is what map-engine.js's renderer and
// Dijkstra implementation both expect. Bends live as nodes (section 3),
// not as data on the edge.
// =============================================================================
const MAP_EDGES = [
    // Bottom Wing loop
    ['N_Recpt_Door', 'N_Recpt_Hall'],
    ['N_Recpt_Hall', 'N_Bot_Lib'],
    ['N_Bot_Lib', 'N_Bot_Math'],
    ['N_Bot_Math', 'N_Bot_Know'],
    ['N_Bot_Know', 'BL_Corner'],

    // Left Wing
    ['BL_Corner', 'N_Left_Board'],
    ['N_Left_Board', 'N_Left_CSEC'],
    ['N_Left_CSEC', 'N_Left_Stage'],
    ['N_Left_Stage', 'N_Left_CDC'],
    ['N_Left_CDC', 'N_Left_AIDS_B'],

    // N_Left_CDC -> TL_Corner, dogleg around CDC Hall's corner
    ['N_Left_CDC', 'J_CDC1'],
    ['J_CDC1', 'J_CDC2'],
    ['J_CDC2', 'J_CDC3'],
    ['J_CDC3', 'TL_Corner'],

    // TL_Corner -> N_Top_AI, around Electrical Cabin
    ['TL_Corner', 'J_TL1'],
    ['J_TL1', 'J_TL2'],
    ['J_TL2', 'N_Top_AI'],

    // Top Wing
    ['N_Top_AI', 'N_Top_DS'],
    ['N_Top_DS', 'N_Top_Mid'],
    ['N_Top_Mid', 'N_Top_Core'],
    ['N_Top_Core', 'TR_Corner'],

    // Right Wing
    ['TR_Corner', 'N_Right_SDC'],
    ['N_Right_SDC', 'N_Right_Lift'],
    ['N_Right_Lift', 'N_Right_Sec'],
    ['N_Right_Sec', 'N_Right_Stair'],
    ['N_Right_Stair', 'N_Right_Princ'],
    ['N_Right_Princ', 'N_Right_Staff'],
    ['N_Right_Staff', 'BR_Corner'],

    // Closing the outer loop
    ['BR_Corner', 'N_Bot_Admin'],
    ['N_Bot_Admin', 'N_Bot_Cash'],
    ['N_Bot_Cash', 'N_Recpt_Hall'],
    ['N_Bot_Cash', 'N_Recpt_Door'],

    // --- Central Courtyard Ring ---
    // West leg: Library up to the courtyard's west junction
    ['N_Bot_Lib', 'J_CY_W1'],
    ['J_CY_W1', 'J_CY_W2'],
    ['J_CY_W2', 'N_Courtyard_Center'],

    // Stage feeds into the same west junction, past the obstacle block
    ['N_Left_Stage', 'J_STAGE1'],
    ['J_STAGE1', 'J_CY_W2'],

    // East leg: Cash Counter up to the courtyard's east junction
    ['N_Bot_Cash', 'J_CY_E1'],
    ['J_CY_E1', 'J_CY_E2'],
    ['J_CY_E2', 'N_Courtyard_Center'],

    // Viscom Hall / Top Mid feeds into the same east junction

    // Right Sec / Second Entrance feeds into the east junction via a
    // horizontal corridor south of the grass lawn
    ['N_Right_Sec', 'J_CY_S1'],
    ['J_CY_S1', 'J_CY_S2'],
    ['J_CY_S2', 'J_CY_E2'],

    // --- Stage / Board Room inner path ---
    ['N_Left_CSEC', 'J_BOARD1'],
    ['J_BOARD1', 'N_Board_Stage'],

    // Board Room -> Math Lab junction, exiting south-east past Idea Hub
    ['N_Board_Stage', 'J_BOARD2'],
    ['J_BOARD2', 'J_BOARD3'],
    ['J_BOARD3', 'J_BOARD4'],
    ['J_BOARD4', 'N_Bot_Math']

    // Board Room reaches the courtyard via the real route:
    // N_Board_Stage -> ... -> N_Bot_Math -> N_Bot_Lib -> J_CY_W1 -> J_CY_W2
    // -> N_Courtyard_Center. There is no direct corridor between Board Room
    // and the courtyard in design.svg, so no direct edge is added.
];

// Attach to window object for global browser access
if (typeof window !== 'undefined') {
    window.MAP_ROOMS = MAP_ROOMS;
    window.STRUCTURAL_RECTS = STRUCTURAL_RECTS;
    window.DECORATIVE_CIRCLES = DECORATIVE_CIRCLES;
    window.DECORATIVE_LINES = DECORATIVE_LINES;
    window.DIRECTION_MARKERS = DIRECTION_MARKERS;
    window.MAP_NODES = MAP_NODES;
    window.MAP_EDGES = MAP_EDGES;
}

// Support Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MAP_ROOMS,
        STRUCTURAL_RECTS,
        DECORATIVE_CIRCLES,
        DECORATIVE_LINES,
        DIRECTION_MARKERS,
        MAP_NODES,
        MAP_EDGES
    };
}
