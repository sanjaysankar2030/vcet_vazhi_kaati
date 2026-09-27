/**
 * This is the mapConfig.js
 * VCET MAP CONFIGURATION
 * =============================================================================
 * Edit room rectangles, structural elements, nodes, and edges here.
 * Any change made here will automatically reflect on the map, the route network,
 * the shortest-path navigation, and the UI dropdowns.
 * =============================================================================
 */

// =============================================================================
// 1. ROOM RECTANGLES CONFIGURATION
// -----------------------------------------------------------------------------
// To change any room size or position:
// Just edit x, y, width, and height!
// Labels will AUTOMATICALLY center inside the rectangle.
// -----------------------------------------------------------------------------
const MAP_ROOMS = [
    // --- Top Wing ---
    {
        id: 'ElectricalCabin',
        name: 'Electrical Cabin',
        lines: ['Electrical', 'Cabin'],
        x: 170, y: 95, width: 80, height: 60,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'TL_Corner'
    },
    {
        id: 'AILab',
        name: 'AI Laboratory',
        lines: ['AI Laboratory'],
        x: 260, y: 95, width: 190, height: 60,
        fill: '#9bc6ff', textClass: 'text-sm',
        node: 'TL_Corner'
    },
    {
        id: 'DSLab',
        name: 'DS Laboratory',
        lines: ['DS Laboratory'],
        x: 460, y: 95, width: 255, height: 60,
        fill: '#9bc6ff', textClass: 'text-sm',
        node: 'N_Top_DS'
    },
    {
        id: 'CoreSpace',
        name: 'Core Space',
        lines: ['Core Space'],
        x: 725, y: 95, width: 295, height: 60,
        fill: '#d9bbf9', textClass: 'text-sm',
        node: 'N_Top_Yuv'
    },
    {
        id: 'YuvarajSir',
        name: 'Yuvaraj Sir Cabin',
        lines: ['Yuvaraj', 'Sir Cabin'],
        x: 1030, y: 95, width: 60, height: 60,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'TR_Corner'
    },

    // --- Left Wing ---
    {
        id: 'CDCHall',
        name: 'CDC Hall',
        lines: ['CDC Hall'],
        x: 95, y: 165, width: 150, height: 70,
        fill: '#ffb3cc', textClass: 'text-sm',
        node: 'W1'
    },
    {
        id: 'StudentRestEast',
        name: 'Student Rest Room (East)',
        lines: ['Student', 'Rest Room'],
        x: 95, y: 245, width: 90, height: 60,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Left_CDC'
    },
    {
        id: 'AIDS_B',
        name: '2nd Year AI-DS B',
        lines: ['2nd Year', 'AI-DS B'],
        x: 95, y: 315, width: 90, height: 65,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_AIDS'
    },
    {
        id: 'AIDS_A',
        name: '2nd Year AI-DS A',
        lines: ['2nd Year', 'AI-DS A'],
        x: 95, y: 390, width: 90, height: 65,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_Stage'
    },
    {
        id: 'CSEC',
        name: '2nd Year CSE-C',
        lines: ['2nd Year', 'CSE-C'],
        x: 95, y: 465, width: 90, height: 65,
        fill: '#f9e770', textClass: 'text-xs',
        node: 'N_Left_Stage'
    },
    {
        id: 'LiftEast',
        name: 'Lift (East)',
        lines: ['Lift'],
        x: 95, y: 540, width: 70, height: 50,
        fill: '#c6a1f9', textClass: 'text-sm',
        node: 'N_Left_Board'
    },
    {
        id: 'StaircaseEast',
        name: 'Staircase (East)',
        lines: ['Staircase'],
        x: 95, y: 600, width: 80, height: 55,
        fill: '#e0e0e0', textClass: 'text-xs',
        node: 'N_Left_Board'
    },
    {
        id: 'NewBuilding',
        name: 'New Building',
        lines: ['New', 'Building'],
        x: 95, y: 665, width: 90, height: 80,
        fill: '#ffb3cc', textClass: 'text-xs',
        node: 'BL_Corner'
    },

    // --- Right Wing ---
    {
        id: 'SDCHall',
        name: 'SDC Hall',
        lines: ['SDC', 'Hall'],
        // Custom polygon shape for SDC Hall
        isPolygon: true,
        points: '1060,165 1105,165 1105,285 1025,285 1025,200',
        textX: 1065, textY: 245,
        fill: '#a0f4a0', textClass: 'text-sm',
        node: 'N_Right_SDC'
    },
    {
        id: 'LiftWest',
        name: 'Lift (West)',
        lines: ['Lift'],
        x: 1035, y: 295, width: 70, height: 50,
        fill: '#c6a1f9', textClass: 'text-sm',
        node: 'N_Right_Lift'
    },
    {
        id: 'StudentRestWest',
        name: 'Student Rest Room (West)',
        lines: ['Student', 'Rest Room'],
        x: 1025, y: 355, width: 80, height: 65,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Right_Rest'
    },
    {
        id: 'SecondEntrance',
        name: 'Second Entrance',
        lines: ['Second', 'Entrance'],
        x: 1035, y: 430, width: 70, height: 55,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'N_Right_Sec'
    },
    {
        id: 'StaircaseWest',
        name: 'Staircase (West)',
        lines: ['Staircase'],
        x: 1035, y: 495, width: 70, height: 50,
        fill: '#e0e0e0', textClass: 'text-xs',
        node: 'N_Right_Stair'
    },
    {
        id: 'PrincipalRoom',
        name: 'Principal Room',
        lines: ['Principal', 'Room'],
        x: 1025, y: 555, width: 80, height: 80,
        fill: '#d9bbf9', textClass: 'text-xs',
        node: 'N_Right_Princ'
    },
    {
        id: 'StaffRestRoom',
        name: 'Staff Rest Room',
        lines: ['Staff', 'Rest Room'],
        x: 1035, y: 645, width: 70, height: 100,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'BR_Corner'
    },

    // --- Bottom Wing ---
    {
        id: 'KnowledgeHub',
        name: 'Knowledge Hub',
        lines: ['Knowledge Hub'],
        x: 195, y: 685, width: 115, height: 60,
        fill: '#d9bbf9', textClass: 'text-xs',
        node: 'N_Bot_Know'
    },
    {
        id: 'MathLab',
        name: 'Math Lab',
        lines: ['Math Lab'],
        x: 320, y: 685, width: 80, height: 60,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Math'
    },
    {
        id: 'Library',
        name: 'Library',
        lines: ['Library'],
        x: 410, y: 685, width: 105, height: 60,
        fill: '#a0f4a0', textClass: 'text-xs',
        node: 'N_Bot_Lib'
    },
    {
        id: 'Reception',
        name: 'Reception',
        lines: ['Reception'],
        x: 540, y: 610, width: 120, height: 65,
        fill: '#ffb3cc', textClass: 'text-xs',
        node: 'N_Recpt_Door'
    },
    {
        id: 'MainEntrance',
        name: 'Main Entrance',
        lines: ['Main Entrance'],
        x: 540, y: 685, width: 120, height: 80,
        fill: '#ffffff', textClass: 'text-sm',
        node: 'N_Recpt_Hall'
    },
    {
        id: 'CashCounter',
        name: 'Cash Counter',
        lines: ['Cash Counter'],
        x: 700, y: 685, width: 95, height: 60,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Cash'
    },
    {
        id: 'AdmissionCentre',
        name: 'Admission Centre',
        lines: ['Admission', 'Centre'],
        x: 805, y: 685, width: 100, height: 60,
        fill: '#a0f4a0', textClass: 'text-xs',
        node: 'N_Bot_Admin'
    },
    {
        id: 'ScholarshipCounter',
        name: 'Scholarship Counter',
        lines: ['Scholarship', 'Counter'],
        x: 915, y: 685, width: 100, height: 60,
        fill: '#fbd394', textClass: 'text-xs',
        node: 'BR_Corner'
    },

    // --- Center Blocks ---
    {
        id: 'AmphiTheatre',
        name: 'Amphi Theatre',
        lines: ['Amphi Theatre'],
        x: 375, y: 175, width: 325, height: 135,
        fill: '#fde4a7', textClass: 'text-main',
        node: 'N_Top_Mid'
    },
    {
        id: 'ViscomHall',
        name: 'Viscom Hall',
        lines: ['Viscom', 'Hall'],
        x: 715, y: 175, width: 165, height: 135,
        fill: '#ffb3cc', textClass: 'text-main',
        textColor: '#3a0ca3',
        node: 'N_Top_Core'
    },
    {
        id: 'Stage',
        name: 'Stage',
        lines: ['Stage'],
        x: 230, y: 350, width: 120, height: 110,
        fill: '#ffb3cc', textClass: 'text-main',
        textColor: '#3a0ca3',
        node: 'N_Left_Stage'
    },
    {
        id: 'BoardRoom',
        name: 'Board Room',
        lines: ['Board Room'],
        x: 220, y: 520, width: 155, height: 145,
        fill: '#a0f4a0', textClass: 'text-main',
        node: 'N_Bot_Know'
    },
    {
        id: 'IdeaHub',
        name: 'Idea Hub',
        lines: ['Idea Hub'],
        x: 385, y: 530, width: 70, height: 90,
        fill: '#9bc6ff', textClass: 'text-xs',
        node: 'N_Bot_Math'
    }
];

// =============================================================================
// 2. STRUCTURAL RECTANGLES & ELEMENTS
// -----------------------------------------------------------------------------
// Corridors, exterior walls, gardens, obstacles, direction markers.
// You can adjust dimensions or positions of these elements anytime!
// =============================================================================
const STRUCTURAL_RECTS = [
    // Outer building frame & corridor
    { id: 'wall-outer', x: 80, y: 80, width: 1040, height: 740, class: 'wall' },
    { id: 'corridor-outer', x: 100, y: 100, width: 1000, height: 700, class: 'corridor' },

    // Center courtyard frame & corridor
    { id: 'wall-center', x: 490, y: 340, width: 220, height: 280, class: 'wall' },
    { id: 'corridor-center', x: 500, y: 350, width: 200, height: 260, class: 'corridor' },

    // East Green Grass Lawn
    { id: 'grass-east-border', x: 740, y: 340, width: 200, height: 300, fill: '#000000' },
    { id: 'grass-east', x: 750, y: 350, width: 180, height: 280, fill: '#73d936', stroke: '#000000', strokeWidth: 2 },

    // West Green Grass Lawn
    { id: 'grass-west-border', x: 360, y: 350, width: 90, height: 150, fill: '#000000' },
    { id: 'grass-west', x: 370, y: 360, width: 70, height: 130, fill: '#73d936', stroke: '#000000', strokeWidth: 2 },

    // Obstacles
    { id: 'obstacle-top-left', x: 260, y: 165, width: 65, height: 70, fill: '#e0e0e0', stroke: '#000000', strokeWidth: 3 },
    { id: 'obstacle-green', x: 230, y: 275, width: 50, height: 45, fill: '#73d936', stroke: '#000000', strokeWidth: 3 },
    { id: 'obstacle-mid-right', x: 895, y: 200, width: 55, height: 70, fill: '#e0e0e0', stroke: '#000000', strokeWidth: 3 },

    // Entrance lines / frame
    { id: 'entrance-frame', x: 500, y: 765, width: 200, height: 40, fill: 'none' }
];

// Decorative circles (Courtyard circles, garden trees, obstacle dots)
const DECORATIVE_CIRCLES = [
    // Center Courtyard Circles
    { cx: 600, cy: 480, r: 30, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 2 },
    { cx: 600, cy: 480, r: 20, fill: '#a0c4ff', stroke: '#000000', strokeWidth: 2 },
    { cx: 600, cy: 480, r: 10, fill: '#f4e04d', stroke: '#000000', strokeWidth: 1 },

    // East Garden Trees
    { cx: 830, cy: 400, r: 20, fill: '#2d6a4f', stroke: '#000000', strokeWidth: 2 },
    { cx: 860, cy: 420, r: 15, fill: '#1b4332', stroke: '#000000', strokeWidth: 2 },
    { cx: 780, cy: 580, r: 20, fill: '#2d6a4f', stroke: '#000000', strokeWidth: 2 },
    { cx: 810, cy: 600, r: 18, fill: '#1b4332', stroke: '#000000', strokeWidth: 2 },

    // Small dots near obstacle
    { cx: 245, cy: 290, r: 5, fill: '#ff0000' },
    { cx: 265, cy: 305, r: 5, fill: '#ff0000' }
];

// Decorative lines (Entrance gates/steps)
const DECORATIVE_LINES = [
    { x1: 520, y1: 775, x2: 680, y2: 775, stroke: '#000000', strokeWidth: 2 },
    { x1: 520, y1: 790, x2: 680, y2: 790, stroke: '#000000', strokeWidth: 2 }
];

// Compass / Direction boxes
const DIRECTION_MARKERS = [
    { label: 'South', x: 540, y: 30, width: 120, height: 40, textX: 600, textY: 57, rotate: null },
    { label: 'North', x: 540, y: 830, width: 120, height: 40, textX: 600, textY: 857, rotate: null },
    { label: 'East', x: 30, y: 410, width: 40, height: 100, textX: 57, textY: 460, rotate: -90 },
    { label: 'West', x: 1130, y: 410, width: 40, height: 100, textX: 1157, textY: 460, rotate: 90 }
];

// =============================================================================
// 3. NAVIGATION NODES (WAYPOINTS)
// -----------------------------------------------------------------------------
// To move any waypoint: Just change its x and y coordinates!
// All connected edge lines, the animated dot, and the node circle
// will automatically move to the new coordinates.
// =============================================================================
const MAP_NODES = {
    // Reception & Bottom Wing
    'N_Recpt_Door':  { x: 600, y: 660, label: 'Reception Door' },
    'N_Recpt_Hall':  { x: 600, y: 680, label: 'Reception Hall' },
    'N_Bot_Lib':     { x: 470, y: 680, label: 'Library Junction' },
    'N_Bot_Math':    { x: 365, y: 680, label: 'Math Lab Junction' },
    'N_Bot_Know':    { x: 280, y: 680, label: 'Knowledge Hub Junction' },
    'BL_Corner':     { x: 200, y: 680, label: 'Bottom-Left Corner' },
    'N_Bot_Cash':    { x: 735, y: 680, label: 'Cash Counter Junction' },
    'N_Bot_Admin':   { x: 870, y: 680, label: 'Admission Centre Junction' },
    'BR_Corner':     { x: 1000, y: 680, label: 'Bottom-Right Corner' },

    // Left Wing
    'N_Left_Board':  { x: 200, y: 550, label: 'Board Room Junction' },
    'N_Left_Stage':  { x: 200, y: 450, label: 'Stage Junction' },
    'N_Left_AIDS':   { x: 200, y: 350, label: 'AI-DS Junction' },
    'N_Left_CDC':    { x: 200, y: 275, label: 'CDC Hall Junction' },
    'W1':            { x: 200, y: 240, label: 'West Waypoint 1' },
    'W2':            { x: 215, y: 240, label: 'West Waypoint 2' },
    'W3':            { x: 215, y: 260, label: 'West Waypoint 3' },
    'W4':            { x: 295, y: 260, label: 'West Waypoint 4' },
    'W5':            { x: 295, y: 235, label: 'West Waypoint 5' },
    'W6':            { x: 340, y: 235, label: 'West Waypoint 6' },

    // Top Wing
    'TL_Corner':     { x: 340, y: 165, label: 'Top-Left Corner' },
    'N_Top_DS':      { x: 470, y: 165, label: 'DS Lab Junction' },
    'N_Top_Mid':     { x: 600, y: 165, label: 'Top Middle (Amphi)' },
    'N_Top_Core':    { x: 735, y: 165, label: 'Core Space Junction' },
    'N_Top_Yuv':     { x: 875, y: 165, label: 'Yuvaraj Cabin Junction' },
    'TR_Corner':     { x: 1000, y: 165, label: 'Top-Right Corner' },

    // Right Wing
    'N_Right_SDC':   { x: 1000, y: 225, label: 'SDC Hall Junction' },
    'N_Right_Lift':  { x: 1000, y: 315, label: 'Right Lift Junction' },
    'N_Right_Rest':  { x: 1000, y: 390, label: 'Right Rest Room Junction' },
    'N_Right_Sec':   { x: 1000, y: 460, label: 'Second Entrance Junction' },
    'N_Right_Stair': { x: 1000, y: 540, label: 'Right Staircase Junction' },
    'N_Right_Princ': { x: 1000, y: 610, label: 'Principal Room Junction' }
};

// =============================================================================
// 4. NAVIGATION EDGES (CONNECTIONS)
// -----------------------------------------------------------------------------
// Connect any two nodes by adding [NodeA, NodeB].
// The visual dashed corridor path lines and pathfinding routes
// are automatically drawn and calculated between these node pairs!
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
    ['N_Left_Board', 'N_Left_Stage'],
    ['N_Left_Stage', 'N_Left_AIDS'],
    ['N_Left_AIDS', 'N_Left_CDC'],
    ['N_Left_CDC', 'W1'],
    ['W1', 'W2'],
    ['W2', 'W3'],
    ['W3', 'W4'],
    ['W4', 'W5'],
    ['W5', 'W6'],
    ['W6', 'TL_Corner'],

    // Top Wing
    ['TL_Corner', 'N_Top_DS'],
    ['N_Top_DS', 'N_Top_Mid'],
    ['N_Top_Mid', 'N_Top_Core'],
    ['N_Top_Core', 'N_Top_Yuv'],
    ['N_Top_Yuv', 'TR_Corner'],

    // Right Wing
    ['TR_Corner', 'N_Right_SDC'],
    ['N_Right_SDC', 'N_Right_Lift'],
    ['N_Right_Lift', 'N_Right_Rest'],
    ['N_Right_Rest', 'N_Right_Sec'],
    ['N_Right_Sec', 'N_Right_Stair'],
    ['N_Right_Stair', 'N_Right_Princ'],
    ['N_Right_Princ', 'BR_Corner'],

    // Closing the Bottom Wing loop
    ['BR_Corner', 'N_Bot_Admin'],
    ['N_Bot_Admin', 'N_Bot_Cash'],
    ['N_Bot_Cash', 'N_Recpt_Hall']
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

// Support Node.js environment (e.g. testing or build scripts)
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

