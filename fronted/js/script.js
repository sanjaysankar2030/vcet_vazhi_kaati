            // --- Auto Floor Switching Logic ---
            let currentFloor = "G";
            function switchFloor(floorId) {
                currentFloor = floorId;
                document
                    .querySelectorAll(".floor-btn")
                    .forEach((btn) => btn.classList.remove("active"));
                document
                    .getElementById("btn-" + floorId)
                    .classList.add("active");

                ["G", "F1", "F2", "F3", "F4", "F5"].forEach((f) => {
                    document
                        .getElementById("floor-" + f)
                        .setAttribute("display", "none");
                });
                document
                    .getElementById("floor-" + floorId)
                    .setAttribute("display", "inline");
            }
            const nodes = {
                // == GROUND FLOOR NODES ==
                C_Top_Left: { x: 200, y: 165, floor: "G" },
                C_Top_Right: { x: 1010, y: 165, floor: "G" },
                C_Bot_Left: { x: 200, y: 675, floor: "G" },
                C_Bot_Right: { x: 1010, y: 675, floor: "G" },
                C_Elec: { x: 210, y: 165, floor: "G" },
                C_AILab: { x: 355, y: 165, floor: "G" },
                C_DSLab: { x: 585, y: 165, floor: "G" },
                C_Viscom: { x: 795, y: 165, floor: "G" },
                C_Core: { x: 870, y: 165, floor: "G" },
                C_Yuv: { x: 1010, y: 125, floor: "G" },
                C_CDC: { x: 1010, y: 225, floor: "G" },
                C_Viscom_W: { x: 1010, y: 285, floor: "G" },
                C_Princ: { x: 1010, y: 610, floor: "G" },
                C_SDC: { x: 200, y: 205, floor: "G" },
                D_SDC: { x: 185, y: 205, floor: "G" },

                // Library, Knowledge Hub & MAC Lab Internal & Corridor Nodes
                C_Lib_Corr: { x: 355, y: 675, floor: "G" },
                C_Know: { x: 277, y: 715, floor: "G" },
                C_Board: { x: 295, y: 675, floor: "G" },
                C_MAC: { x: 427, y: 715, floor: "G" },
                C_Idea: { x: 420, y: 675, floor: "G" },
                C_Recpt: { x: 600, y: 675, floor: "G" },
                C_Cash: { x: 747, y: 675, floor: "G" },
                C_Admin: { x: 855, y: 675, floor: "G" },
                C_Schol: { x: 965, y: 675, floor: "G" },
                C_RestE: { x: 200, y: 275, floor: "G" },
                C_AIDS_B: { x: 200, y: 350, floor: "G" },
                C_AIDS_A: { x: 200, y: 425, floor: "G" },
                C_Cross_Junc_L: { x: 200, y: 460, floor: "G" },
                C_CSEC: { x: 200, y: 500, floor: "G" },
                C_LiftE: { x: 200, y: 565, floor: "G" },
                C_LiftW: { x: 1010, y: 315, floor: "G" },
                C_RestW: { x: 1010, y: 390, floor: "G" },
                C_SecEnt: { x: 1010, y: 460, floor: "G" },

                // SPLIT STAIRCASE NODES FOR GROUND FLOOR
                C_StairE_L: { x: 190, y: 630, floor: "G" },
                C_StairE_R: { x: 210, y: 630, floor: "G" },
                C_StairW_L: { x: 1000, y: 520, floor: "G" },
                C_StairW_R: { x: 1020, y: 520, floor: "G" },

                C_Cross_Stage: { x: 295, y: 460, floor: "G" },
                C_Cross_Left: { x: 400, y: 460, floor: "G" },
                C_Cross_Courtyard: { x: 600, y: 460, floor: "G" },
                C_Cross_Right: { x: 850, y: 460, floor: "G" },
                C_Top_Weave: { x: 295, y: 165, floor: "G" },
                C_New_Corner: { x: 295, y: 330, floor: "G" },
                C_New_Center: { x: 600, y: 330, floor: "G" },

                // Xerox Added Verticals
                C_Xerox_BL: { x: 500, y: 675, floor: "G" },
                C_Xerox_BR: { x: 700, y: 675, floor: "G" },
                C_Xerox_TL: { x: 500, y: 460, floor: "G" },
                C_Xerox_TR: { x: 700, y: 460, floor: "G" },

                // Door Nodes
                D_Elec: { x: 210, y: 155, floor: "G" },
                D_AILab: { x: 355, y: 155, floor: "G" },
                D_DSLab: { x: 585, y: 155, floor: "G" },
                D_Viscom: { x: 890, y: 285, floor: "G" },
                D_Core: { x: 870, y: 155, floor: "G" },
                D_Yuv: { x: 1030, y: 125, floor: "G" },
                D_CDC: { x: 1025, y: 225, floor: "G" },
                D_LiftW: { x: 1035, y: 315, floor: "G" },
                D_RestW: { x: 1025, y: 390, floor: "G" },
                D_SecEnt: { x: 1035, y: 460, floor: "G" },
                D_Princ: { x: 1025, y: 610, floor: "G" },
                D_StaffW: { x: 1035, y: 680, floor: "G" },
                D_Schol: { x: 965, y: 685, floor: "G" },
                D_Admin: { x: 855, y: 685, floor: "G" },
                D_Cash: { x: 747, y: 685, floor: "G" },
                D_Lib: { x: 500, y: 715, floor: "G" },
                D_Know: { x: 277, y: 703, floor: "G" },
                D_MAC: { x: 427, y: 703, floor: "G" },
                D_Idea: { x: 420, y: 620, floor: "G" },
                D_Board: { x: 295, y: 665, floor: "G" },
                D_NewBldg: { x: 185, y: 680, floor: "G" },
                D_LiftE: { x: 165, y: 565, floor: "G" },
                D_CSEC: { x: 185, y: 500, floor: "G" },
                D_AIDS_A: { x: 185, y: 425, floor: "G" },
                D_AIDS_B: { x: 185, y: 350, floor: "G" },
                D_RestE: { x: 185, y: 275, floor: "G" },
                D_Amphi: { x: 600, y: 310, floor: "G" },
                D_Stage: { x: 290, y: 440, floor: "G" },
                D_Xerox: { x: 600, y: 675, floor: "G" },
                D_RecptNew: { x: 600, y: 715, floor: "G" },
                D_MainEntNew: { x: 600, y: 800, floor: "G" },
                D_StairE: { x: 175, y: 630, floor: "G" },
                D_StairW: { x: 1035, y: 520, floor: "G" },
            };
            //'D_RecptNew': {x: 600, y: 715, floor: 'G'}
            //
            const edges = [
                // Ground Floor Corridor Edges
                ["C_Elec", "C_Top_Left"],
                ["C_Elec", "C_Top_Weave"],
                ["C_Top_Weave", "C_AILab"],
                ["C_AILab", "C_DSLab"],
                ["C_DSLab", "C_Viscom"],
                ["C_Viscom", "C_Core"],
                ["C_Core", "C_Top_Right"],
                ["C_Top_Right", "C_Yuv"],
                ["C_Top_Right", "C_CDC"],
                ["C_CDC", "C_Viscom_W"],
                ["C_Viscom_W", "C_LiftW"],
                ["C_LiftW", "C_RestW"],
                ["C_RestW", "C_SecEnt"],
                ["D_SDC", "C_SDC"],

                ["C_SecEnt", "C_StairW_L"],
                ["C_SecEnt", "C_StairW_R"],
                ["C_StairW_L", "C_Princ"],
                ["C_StairW_R", "C_Princ"],
                ["C_Princ", "C_Bot_Right"],

                // Direct Library & Nested Rooms Network Edges (Skipping C_Library_Int)
                //['C_Bot_Left', 'C_Lib_Corr'],
                //['C_Lib_Corr', 'C_Xerox_BL'],
                // Board Room corridor connections
                ["C_Bot_Left", "C_Board"],
                ["C_Board", "C_Lib_Corr"],

                // Idea Hub corridor connections
                ["C_Lib_Corr", "C_Idea"],
                ["C_Idea", "C_Xerox_BL"],
                ["D_Lib", "C_Lib"],
                ["D_Know", "D_MAC"],
                ["D_Know", "C_Know"],
                ["D_MAC", "C_MAC"],
                ["D_MAC", "D_Lib"],
                ["D_Lib", "C_Xerox_BL"],
                ["D_RecptNew", "D_Lib"],

                ["C_Xerox_BL", "C_Recpt"],
                ["C_Recpt", "C_Xerox_BR"],
                ["C_Xerox_BR", "C_Cash"],
                ["C_Xerox_BR", "C_Xerox_TR"],
                ["C_Cash", "C_Admin"],
                ["C_Admin", "C_Schol"],
                ["C_Schol", "C_Bot_Right"],

                ["C_Top_Left", "C_SDC"],
                ["C_SDC", "C_RestE"],
                ["C_RestE", "C_AIDS_B"],
                ["C_AIDS_B", "C_AIDS_A"],
                ["C_AIDS_A", "C_Cross_Junc_L"],
                ["C_Cross_Junc_L", "C_CSEC"],
                ["C_CSEC", "C_LiftE"],

                ["C_LiftE", "C_StairE_L"],
                ["C_LiftE", "C_StairE_R"],
                ["C_StairE_L", "C_Bot_Left"],
                ["C_StairE_R", "C_Bot_Left"],

                ["C_Cross_Stage", "C_Cross_Left"],
                ["C_Cross_Left", "C_Xerox_TL"],
                ["C_Xerox_TL", "C_Cross_Courtyard"],
                ["C_Cross_Courtyard", "C_Xerox_TR"],
                ["C_Xerox_TR", "C_Cross_Right"],
                ["C_Cross_Right", "C_SecEnt"],

                // New Vertical Paths around Xerox
                ["C_Xerox_TL", "C_Xerox_BL"],
                ["C_Xerox_TR", "C_Xerox_BR"],

                ["C_Top_Weave", "C_New_Corner"],
                ["C_New_Corner", "C_New_Center"],
                ["C_New_Corner", "C_Cross_Stage"],
                ["C_Cross_Courtyard", "C_New_Center"],
                ["C_New_Center", "D_Amphi"],
                ["C_Cross_Stage", "D_Stage"],

                // Ground Door Links
                ["D_Elec", "C_Elec"],
                ["D_AILab", "C_AILab"],
                ["D_DSLab", "C_DSLab"],
                ["D_Viscom", "C_Viscom_W"],
                ["D_Core", "C_Core"],
                ["D_Yuv", "C_Yuv"],
                ["D_CDC", "C_CDC"],
                ["D_LiftW", "C_LiftW"],
                ["D_RestW", "C_RestW"],
                ["D_SecEnt", "C_SecEnt"],
                ["D_Princ", "C_Princ"],
                ["D_StaffW", "C_Bot_Right"],
                ["D_Schol", "C_Schol"],
                ["D_Admin", "C_Admin"],
                ["D_Cash", "C_Cash"],
                ["D_Idea", "C_Idea"],
                ["D_Board", "C_Board"],
                ["D_NewBldg", "C_Bot_Left"],
                ["D_LiftE", "C_LiftE"],
                ["D_CSEC", "C_CSEC"],
                ["D_AIDS_A", "C_AIDS_A"],
                ["D_AIDS_B", "C_AIDS_B"],
                ["D_RestE", "C_RestE"],
                ["D_Xerox", "C_Recpt"],
                ["D_RecptNew", "C_Recpt"],
                ["D_MainEntNew", "D_RecptNew"],

                ["D_StairE", "C_StairE_L"],
                ["D_StairE", "C_StairE_R"],
                ["D_StairW", "C_StairW_L"],
                ["D_StairW", "C_StairW_R"],
            ];

            const locationMap = {
                MainEntrance: "D_MainEntNew",
                Reception: "D_RecptNew",
                XeroxCenter: "D_Xerox",
                SecondEntrance: "D_SecEnt",
                ElectricalCabin: "D_Elec",
                AILab: "D_AILab",
                DSLab: "D_DSLab",
                CoreSpace: "D_Core",
                YuvarajSir: "D_Yuv",
                CDCHall: "D_CDC",
                StudentRestEast: "D_RestE",
                AIDS_B: "D_AIDS_B",
                AIDS_A: "D_AIDS_A",
                CSEC: "D_CSEC",
                LiftEast: "D_LiftE",
                StaircaseEast: "D_StairE",
                NewBuilding: "D_NewBldg",
                SDCHall: "D_SDC",
                LiftWest: "D_LiftW",
                StudentRestWest: "D_RestW",
                StaircaseWest: "D_StairW",
                PrincipalRoom: "D_Princ",
                StaffRestRoom: "D_StaffW",
                KnowledgeHub: "D_Know",
                MACLab: "D_MAC",
                Library: "D_Lib",
                CashCounter: "D_Cash",
                AdmissionCentre: "D_Admin",
                ScholarshipCounter: "D_Schol",
                AmphiTheatre: "D_Amphi",
                ViscomHall: "D_Viscom",
                Stage: "D_Stage",
                BoardRoom: "D_Board",
                IdeaHub: "D_Idea",
            };

            // --- Upper Floors Strict Rectangular Perimeters ---
            const upperFloors = ["F1", "F2", "F3", "F4", "F5"];

            upperFloors.forEach((f) => {
                nodes[`${f}_TL`] = { x: 200, y: 165, floor: f };
                nodes[`${f}_TR`] = { x: 1010, y: 165, floor: f };
                nodes[`${f}_BR`] = { x: 1010, y: 675, floor: f };
                nodes[`${f}_BL`] = { x: 200, y: 675, floor: f };

                nodes[`${f}_C_Bot_Center`] = { x: 600, y: 675, floor: f };

                nodes[`${f}_C_Room1`] = { x: 210, y: 165, floor: f };
                nodes[`${f}_C_LabA`] = { x: 355, y: 165, floor: f };
                nodes[`${f}_C_LabB`] = { x: 585, y: 165, floor: f };
                nodes[`${f}_C_Room2`] = { x: 200, y: 235, floor: f };
                nodes[`${f}_C_Board`] = { x: 295, y: 675, floor: f };
                nodes[`${f}_C_Viscom`] = { x: 1010, y: 285, floor: f };

                if (f === "F1") {
                    nodes[`F1_C_StairW_L`] = { x: 1000, y: 520, floor: "F1" };
                    nodes[`F1_C_StairW_R`] = { x: 1020, y: 520, floor: "F1" };
                    nodes[`F1_C_StairE_L`] = { x: 190, y: 630, floor: "F1" };
                    nodes[`F1_C_StairE_R`] = { x: 210, y: 630, floor: "F1" };
                    nodes[`F1_C_CenterStair_L`] = {
                        x: 590,
                        y: 635,
                        floor: "F1",
                    };
                    nodes[`F1_C_CenterStair_R`] = {
                        x: 610,
                        y: 635,
                        floor: "F1",
                    };
                } else {
                    nodes[`${f}_C_StairW`] = { x: 1010, y: 520, floor: f };
                    nodes[`${f}_C_StairE`] = { x: 200, y: 630, floor: f };
                    nodes[`${f}_C_CenterStair`] = { x: 600, y: 635, floor: f };
                }

                nodes[`${f}_D_Room1`] = { x: 210, y: 155, floor: f };
                nodes[`${f}_D_LabA`] = { x: 355, y: 155, floor: f };
                nodes[`${f}_D_LabB`] = { x: 585, y: 155, floor: f };
                nodes[`${f}_D_Room2`] = { x: 245, y: 235, floor: f };
                nodes[`${f}_D_StairE`] = { x: 292, y: 205, floor: f };
                nodes[`${f}_D_StairW`] = { x: 895, y: 200, floor: f };
                nodes[`${f}_D_Viscom`] = { x: 890, y: 285, floor: f };
                nodes[`${f}_D_Board`] = { x: 295, y: 665, floor: f };
                if (f === "F1")
                    nodes[`F1_D_CenterStair`] = { x: 600, y: 655, floor: "F1" };

                edges.push(
                    [`${f}_TL`, `${f}_C_Room1`],
                    [`${f}_C_Room1`, `${f}_C_LabA`],
                    [`${f}_C_LabA`, `${f}_C_LabB`],
                    [`${f}_C_LabB`, `${f}_TR`],
                    [`${f}_TL`, `${f}_C_Room2`],
                    [`${f}_BL`, `${f}_C_Board`],
                    [`${f}_C_Board`, `${f}_C_Bot_Center`],
                    [`${f}_C_Bot_Center`, `${f}_BR`],
                );

                if (f === "F1") {
                    edges.push(
                        [`${f}_C_Room2`, `F1_C_StairE_L`],
                        [`${f}_C_Room2`, `F1_C_StairE_R`],
                        [`F1_C_StairE_L`, `${f}_BL`],
                        [`F1_C_StairE_R`, `${f}_BL`],
                        [`${f}_TR`, `${f}_C_Viscom`],
                        [`${f}_C_Viscom`, `F1_C_StairW_L`],
                        [`${f}_C_Viscom`, `F1_C_StairW_R`],
                        [`F1_C_StairW_L`, `${f}_BR`],
                        [`F1_C_StairW_R`, `${f}_BR`],
                        [`F1_C_CenterStair_L`, `${f}_C_Bot_Center`],
                        [`F1_C_CenterStair_R`, `${f}_C_Bot_Center`],
                    );
                } else {
                    edges.push(
                        [`${f}_C_Room2`, `${f}_C_StairE`],
                        [`${f}_C_StairE`, `${f}_BL`],
                        [`${f}_TR`, `${f}_C_Viscom`],
                        [`${f}_C_Viscom`, `${f}_C_StairW`],
                        [`${f}_C_StairW`, `${f}_BR`],
                        [`${f}_C_CenterStair`, `${f}_C_Bot_Center`],
                    );
                }

                edges.push(
                    [`${f}_D_Room1`, `${f}_C_Room1`],
                    [`${f}_D_LabA`, `${f}_C_LabA`],
                    [`${f}_D_LabB`, `${f}_C_LabB`],
                    [`${f}_D_Room2`, `${f}_C_Room2`],
                    [`${f}_D_Viscom`, `${f}_C_Viscom`],
                    [`${f}_D_Board`, `${f}_C_Board`],
                );

                if (f === "F1") {
                    edges.push(
                        [`${f}_D_StairE`, `F1_C_StairE_L`],
                        [`${f}_D_StairE`, `F1_C_StairE_R`],
                        [`${f}_D_StairW`, `F1_C_StairW_L`],
                        [`${f}_D_StairW`, `F1_C_StairW_R`],
                        [`${f}_D_CenterStair`, `F1_C_CenterStair_L`],
                        [`${f}_D_CenterStair`, `F1_C_CenterStair_R`],
                    );
                } else {
                    edges.push(
                        [`${f}_D_StairE`, `${f}_C_StairE`],
                        [`${f}_D_StairW`, `${f}_C_StairW`],
                    );
                }

                locationMap[`${f}_StaircaseEast`] = `${f}_D_StairE`;
                locationMap[`${f}_StaircaseWest`] = `${f}_D_StairW`;
                if (f === "F1")
                    locationMap[`${f}_CenterStaircase`] = `${f}_D_CenterStair`;
                locationMap[`${f}_Room1`] = `${f}_D_Room1`;
                locationMap[`${f}_Room2`] = `${f}_D_Room2`;
                locationMap[`${f}_LabA`] = `${f}_D_LabA`;
                locationMap[`${f}_LabB`] = `${f}_D_LabB`;
                locationMap[`${f}_ViscomHall`] = `${f}_D_Viscom`;
                locationMap[`${f}_BoardRoom`] = `${f}_D_Board`;
            });

            for (let i = 0; i < upperFloors.length; i++) {
                let f = upperFloors[i];
                if (i === 0) {
                    edges.push(
                        ["C_StairW_L", "F1_C_StairW_R"],
                        ["C_StairW_R", "F1_C_StairW_L"],
                        ["C_StairE_L", "F1_C_StairE_R"],
                        ["C_StairE_R", "F1_C_StairE_L"],
                        ["C_CenterStair_L", "F1_C_CenterStair_R"],
                        ["C_CenterStair_R", "F1_C_CenterStair_L"],
                    );
                } else if (i === 1) {
                    edges.push(
                        ["F1_C_StairW_L", "F2_C_StairW"],
                        ["F1_C_StairW_R", "F2_C_StairW"],
                        ["F1_C_StairE_L", "F2_C_StairE"],
                        ["F1_C_StairE_R", "F2_C_StairE"],
                        ["F1_C_CenterStair_L", "F2_C_CenterStair"],
                        ["F1_C_CenterStair_R", "F2_C_CenterStair"],
                    );
                } else {
                    let prevF = upperFloors[i - 1];
                    edges.push(
                        [`${prevF}_C_StairW`, `${f}_C_StairW`],
                        [`${prevF}_C_StairE`, `${f}_C_StairE`],
                        [`${prevF}_C_CenterStair`, `${f}_C_CenterStair`],
                    );
                }
            }

            upperFloors.forEach((f) => {
                const srcGroup = document.getElementById(
                    `src-${f.toLowerCase()}`,
                );
                const destGroup = document.getElementById(
                    `dest-${f.toLowerCase()}`,
                );
                if (srcGroup && destGroup) {
                    const optionsHTML = `
                    <option value="${f}_StaircaseEast">${f} Staircase (East)</option>
                    <option value="${f}_StaircaseWest">${f} Staircase (West)</option>
                    ${f === "F1" ? `<option value="${f}_CenterStaircase">${f} Center Staircase</option>` : ""}
                    <option value="${f}_Room1">${f} Room 1</option>
                    <option value="${f}_Room2">${f} Room 2</option>
                    <option value="${f}_LabA">${f} Lab A</option>
                    <option value="${f}_LabB">${f} Lab B</option>
                    <option value="${f}_ViscomHall">${f} Viscom Hall</option>
                    <option value="${f}_BoardRoom">${f} Board Room</option>
                `;
                    srcGroup.innerHTML = optionsHTML;
                    destGroup.innerHTML = optionsHTML;
                }
            });

            function initializeMapInteractions() {
                if (window.panZoom || !document.getElementById("campus-map")) {
                    return;
                }

                const allFloors = ["G", ...upperFloors];
                edges.forEach((edge) => {
                    const p1 = nodes[edge[0]];
                    const p2 = nodes[edge[1]];
                    if (p1 && p2 && p1.floor === p2.floor) {
                        const line = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "line",
                        );
                        line.setAttribute("x1", p1.x);
                        line.setAttribute("y1", p1.y);
                        line.setAttribute("x2", p2.x);
                        line.setAttribute("y2", p2.y);
                        line.setAttribute("class", "path-line");
                        document
                            .getElementById(`dynamic-paths-${p1.floor}`)
                            .appendChild(line);
                    }
                });

                for (let key in nodes) {
                    const pt = nodes[key];
                    const circle = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle",
                    );
                    circle.setAttribute("cx", pt.x);
                    circle.setAttribute("cy", pt.y);
                    circle.setAttribute(
                        "class",
                        key.includes("D_") ? "door-node" : "path-node",
                    );
                    document
                        .getElementById(`dynamic-nodes-${pt.floor}`)
                        .appendChild(circle);
                }

                var eventsHandler = {
                    haltEventListeners: [
                        "touchstart",
                        "touchend",
                        "touchmove",
                        "touchleave",
                        "touchcancel",
                    ],
                    init: function (options) {
                        var instance = options.instance,
                            initialScale = 1,
                            pannedX = 0,
                            pannedY = 0;
                        this.hammer = Hammer(options.svgElement, {
                            recognizers: [
                                [
                                    Hammer.Pan,
                                    { direction: Hammer.DIRECTION_ALL },
                                ],
                                [Hammer.Pinch],
                            ],
                        });
                        this.hammer.on("panstart panmove", function (ev) {
                            if (ev.type === "panstart") {
                                pannedX = 0;
                                pannedY = 0;
                            }
                            instance.panBy({
                                x: ev.deltaX - pannedX,
                                y: ev.deltaY - pannedY,
                            });
                            pannedX = ev.deltaX;
                            pannedY = ev.deltaY;
                        });
                        this.hammer.on("pinchstart pinchmove", function (ev) {
                            if (ev.type === "pinchstart") {
                                initialScale = instance.getZoom();
                            }
                            instance.zoomAtPoint(initialScale * ev.scale, {
                                x: ev.center.x,
                                y: ev.center.y,
                            });
                        });
                        options.svgElement.addEventListener(
                            "touchmove",
                            function (e) {
                                e.preventDefault();
                            },
                            { passive: false },
                        );
                    },
                    destroy: function () {
                        this.hammer.destroy();
                    },
                };

                const campusMap = document.getElementById("campus-map");
                campusMap.setAttribute("width", "1200");
                campusMap.setAttribute("height", "900");
                campusMap.setAttribute("preserveAspectRatio", "xMidYMid meet");
                campusMap.style.width = "100%";
                campusMap.style.height = "100%";

                window.panZoom = svgPanZoom("#campus-map", {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: false,
                    center: true,
                    minZoom: 0.5,
                    maxZoom: 10,
                    customEventsHandler: eventsHandler,
                });
            }

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", initializeMapInteractions, {
                    once: true,
                });
            } else {
                initializeMapInteractions();
            }

            const TopLeftGPS = { lat: 11.275, lon: 77.608 };
            const BotRightGPS = { lat: 11.274, lon: 77.609 };
            for (let key in nodes) {
                if (!nodes[key].lat) {
                    nodes[key].lat =
                        TopLeftGPS.lat -
                        ((nodes[key].y - 80) / 740) *
                            (TopLeftGPS.lat - BotRightGPS.lat);
                    nodes[key].lon =
                        TopLeftGPS.lon +
                        ((nodes[key].x - 80) / 1040) *
                            (BotRightGPS.lon - TopLeftGPS.lon);
                }
            }
            function getDistance(lat1, lon1, lat2, lon2) {
                const R = 6371e3;
                const p1 = (lat1 * Math.PI) / 180;
                const p2 = (lat2 * Math.PI) / 180;
                const dp = ((lat2 - lat1) * Math.PI) / 180;
                const dl = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                    Math.sin(dp / 2) * Math.sin(dp / 2) +
                    Math.cos(p1) *
                        Math.cos(p2) *
                        Math.sin(dl / 2) *
                        Math.sin(dl / 2);
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            }

            let liveWatchId = null;
            let activeSnappedNode = null;
            let candidateNode = null;
            let candidateCount = 0;
            const liveBtn = document.getElementById("live-btn");
            const liveUserGroup = document.getElementById("live-user-group");
            const liveDot = document.getElementById("live-dot");
            const pulseRing = document.getElementById("pulse-ring");

            liveBtn.addEventListener("click", () => {
                if (liveWatchId) {
                    navigator.geolocation.clearWatch(liveWatchId);
                    liveWatchId = null;
                    liveUserGroup.setAttribute("display", "none");
                    liveBtn.innerText = "📍 Start Live Tracking";
                    liveBtn.style.backgroundColor = "#28a745";
                    document.getElementById("status").innerText =
                        "Live tracking stopped.";
                } else {
                    if ("geolocation" in navigator) {
                        liveBtn.innerText = "Tracking...";
                        liveBtn.style.backgroundColor = "#dc3545";
                        liveUserGroup.setAttribute("display", "block");
                        document.getElementById("status").innerText =
                            "Searching for nearest node...";
                        liveWatchId = navigator.geolocation.watchPosition(
                            (position) => {
                                const lat = position.coords.latitude;
                                const lon = position.coords.longitude;
                                let closestNode = null;
                                let minDist = Infinity;
                                for (let key in nodes) {
                                    if (
                                        nodes[key].floor === currentFloor &&
                                        nodes[key].lat
                                    ) {
                                        let dist = getDistance(
                                            lat,
                                            lon,
                                            nodes[key].lat,
                                            nodes[key].lon,
                                        );
                                        if (dist < minDist) {
                                            minDist = dist;
                                            closestNode = key;
                                        }
                                    }
                                }
                                if (closestNode === candidateNode) {
                                    candidateCount++;
                                } else {
                                    candidateNode = closestNode;
                                    candidateCount = 1;
                                }
                                if (
                                    candidateCount >= 3 ||
                                    activeSnappedNode === null
                                ) {
                                    if (activeSnappedNode !== closestNode) {
                                        activeSnappedNode = closestNode;
                                        const pt = nodes[activeSnappedNode];
                                        liveDot.setAttribute("cx", pt.x);
                                        liveDot.setAttribute("cy", pt.y);
                                        pulseRing.setAttribute("cx", pt.x);
                                        pulseRing.setAttribute("cy", pt.y);
                                        document.getElementById(
                                            "status",
                                        ).innerText =
                                            `Live: Snapped near ${activeSnappedNode}`;
                                    }
                                }
                            },
                            (error) => {
                                alert("GPS Error.");
                                liveBtn.click();
                            },
                            {
                                enableHighAccuracy: true,
                                maximumAge: 0,
                                timeout: 10000,
                            },
                        );
                    }
                }
            });

            function findShortestPath(startNode, endNode) {
                const distances = {},
                    prev = {},
                    queue = [];
                for (let v in nodes) {
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
                                const isInterFloor =
                                    nodes[u].floor !== nodes[neighbor].floor;
                                const dist = isInterFloor
                                    ? 500
                                    : Math.hypot(
                                          nodes[u].x - nodes[neighbor].x,
                                          nodes[u].y - nodes[neighbor].y,
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

            let currentAnimation = null;

            document
                .getElementById("navigate-btn")
                .addEventListener("click", () => {
                    const destSelect = document.getElementById("destination");
                    const src = document.getElementById("source").value;
                    const dest = destSelect.value;
                    const destName =
                        destSelect.options[destSelect.selectedIndex].text;
                    const status = document.getElementById("status");

                    if (src === dest) {
                        status.innerText = "Already at destination.";
                        return;
                    }

                    const pathNodes = findShortestPath(
                        locationMap[src],
                        locationMap[dest],
                    );

                    if (pathNodes.length > 0) {
                        const allFloors = ["G", ...upperFloors];
                        allFloors.forEach((f) =>
                            document
                                .getElementById(`highlighted-path-${f}`)
                                .setAttribute("d", ""),
                        );

                        let pathsByFloor = {
                            G: "",
                            F1: "",
                            F2: "",
                            F3: "",
                            F4: "",
                            F5: "",
                        };
                        let minX = Infinity,
                            maxX = -Infinity,
                            minY = Infinity,
                            maxY = -Infinity;
                        let startFloor = nodes[pathNodes[0]].floor;

                        if (currentFloor !== startFloor) {
                            switchFloor(startFloor);
                        }

                        let prevPt = null;
                        pathNodes.forEach((nodeId, index) => {
                            const pt = nodes[nodeId];
                            if (pt.floor === currentFloor) {
                                if (pt.x < minX) minX = pt.x;
                                if (pt.x > maxX) maxX = pt.x;
                                if (pt.y < minY) minY = pt.y;
                                if (pt.y > maxY) maxY = pt.y;
                            }
                            if (!prevPt || prevPt.floor !== pt.floor) {
                                pathsByFloor[pt.floor] += `M ${pt.x} ${pt.y} `;
                            } else {
                                pathsByFloor[pt.floor] += `L ${pt.x} ${pt.y} `;
                            }
                            prevPt = pt;
                        });

                        allFloors.forEach((f) =>
                            document
                                .getElementById(`highlighted-path-${f}`)
                                .setAttribute("d", pathsByFloor[f]),
                        );

                        if (window.panZoom && minX !== Infinity) {
                            window.panZoom.reset();
                            let centerX = (minX + maxX) / 2;
                            let centerY = (minY + maxY) / 2;
                            let boxWidth = Math.max(maxX - minX, 100) * 1.3;
                            let boxHeight = Math.max(maxY - minY, 100) * 1.3;
                            let sizes = window.panZoom.getSizes();
                            let initialRealZoom = Math.min(
                                sizes.width / 1200,
                                sizes.height / 900,
                            );
                            let desiredRealZoom = Math.min(
                                sizes.width / boxWidth,
                                sizes.height / boxHeight,
                            );
                            let targetRelativeZoom = Math.min(
                                Math.max(desiredRealZoom / initialRealZoom, 1),
                                6,
                            );
                            window.panZoom.zoom(targetRelativeZoom);
                            let actualRealZoom =
                                window.panZoom.getSizes().realZoom;
                            window.panZoom.pan({
                                x: sizes.width / 2 - centerX * actualRealZoom,
                                y: sizes.height / 2 - centerY * actualRealZoom,
                            });
                        }

                        const dot = document.getElementById("animated-dot");
                        dot.style.display = "block";
                        let endFloor =
                            nodes[pathNodes[pathNodes.length - 1]].floor;

                        status.innerText = `Routing smoothly to ${destName}...`;

                        if (currentAnimation) clearInterval(currentAnimation);
                        let i = 0;
                        dot.setAttribute("cx", nodes[pathNodes[0]].x);
                        dot.setAttribute("cy", nodes[pathNodes[0]].y);

                        currentAnimation = setInterval(() => {
                            i++;
                            if (i >= pathNodes.length) {
                                clearInterval(currentAnimation);
                                if (currentFloor !== endFloor) {
                                    switchFloor(endFloor);
                                    dot.style.display = "block";
                                }
                                status.innerText = `Arrived at ${destName}!`;
                                return;
                            }

                            let targetNode = nodes[pathNodes[i]];

                            if (targetNode.floor !== currentFloor) {
                                switchFloor(targetNode.floor);
                                status.innerText = `Switched to ${targetNode.floor === "G" ? "Ground Floor" : "Floor " + targetNode.floor.replace("F", "")}...`;
                            }

                            dot.style.display = "block";
                            dot.setAttribute("cx", targetNode.x);
                            dot.setAttribute("cy", targetNode.y);
                        }, 300);
                    }
                });

            async function loadExternalFloorSvgs() {
                const mapContent = document.getElementById("map-content");

                const files = [
                    "svg/ground-floor.svg",
                    "svg/first-floor.svg",
                    "svg/second-floor.svg",
                    "svg/third-floor.svg",
                    "svg/fourth-floor.svg",
                    "svg/fifth-floor.svg"
                ];

                for (const file of files) {
                    const response = await fetch(file);

                    if (!response.ok) {
                        throw new Error(`Could not load ${file}`);
                    }

                    const svgText = await response.text();

                    const doc = new DOMParser().parseFromString(
                        svgText,
                        "image/svg+xml"
                    );

                    if (doc.querySelector("parsererror")) {
                        throw new Error(`Invalid SVG: ${file}`);
                    }

                    const floorGroup = doc.querySelector(
                        "svg > g[id^='floor-']"
                    );

                    if (!floorGroup) {
                        throw new Error(`No floor group found in ${file}`);
                    }

                    mapContent.appendChild(
                        document.importNode(floorGroup, true)
                    );
                }
            }
