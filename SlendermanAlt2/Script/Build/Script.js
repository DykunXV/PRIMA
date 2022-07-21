"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class DropToGroundInitial extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(DropToGroundInitial);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    document.addEventListener("interactiveViewportStarted", this.setPosition);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        setPosition = () => {
            const graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"];
            const ground = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            const cmpMeshTerrain = ground.getComponent(ƒ.ComponentMesh);
            const meshTerrain = cmpMeshTerrain.mesh;
            const distance = meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, cmpMeshTerrain.mtxWorld).distance;
            this.node.mtxLocal.translateY(-distance);
        };
    }
    Script.DropToGroundInitial = DropToGroundInitial;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class DropToGroundMove extends ƒ.ComponentScript {
        static graph;
        static ground;
        static cmpMeshTerrain;
        static meshTerrain;
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(DropToGroundMove);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.setPosition);
        }
        setPosition = (_event) => {
            if (!DropToGroundMove.graph) {
                DropToGroundMove.graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"];
                DropToGroundMove.ground = DropToGroundMove.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
                DropToGroundMove.cmpMeshTerrain = DropToGroundMove.ground.getComponent(ƒ.ComponentMesh);
                DropToGroundMove.meshTerrain = DropToGroundMove.cmpMeshTerrain.mesh;
            }
            const distance = DropToGroundMove.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, DropToGroundMove.cmpMeshTerrain.mtxWorld).distance;
            this.node.mtxLocal.translateY(-distance);
        };
    }
    Script.DropToGroundMove = DropToGroundMove;
})(Script || (Script = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    let viewport;
    let root;
    let player;
    let playerCmpCam;
    let speedRot = 0.1;
    let rotationX = 0;
    let playerWalkControl = new ƒ.Control("playerWalkControl", 1.5, 0 /* PROPORTIONAL */);
    let playerRunControl = new ƒ.Control("playerRunControl", 3, 0 /* PROPORTIONAL */);
    let slenderman;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        player = root.getChildrenByName("Player")[0];
        slenderman = root.getChildrenByName("Slenderman")[0];
        playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        viewport.camera = playerCmpCam; //Active viewport camera is player view
        viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        playerControl();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndPointerMove(_event) {
        player.mtxLocal.rotateY(-_event.movementX * speedRot);
        rotationX += _event.movementY * speedRot;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function playerControl() {
        let inputForward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        playerWalkControl.setInput(inputForward);
        player.mtxLocal.translateZ(playerWalkControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        let inputSideways = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
        playerWalkControl.setInput(inputSideways);
        player.mtxLocal.translateX(playerWalkControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        /*
        let inputRun: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.SHIFT_LEFT], [ƒ.KEYBOARD_CODE.ALT_LEFT]);
        playerRunControl.setInput(inputRun);
        player.mtxLocal.translateZ(playerRunControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        */
    }
})(Slenderman || (Slenderman = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Slenderman extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Slenderman);
        // Properties may be mutated by users in the editor via the automatically created user interface
        timeToChange = 0;
        direction = ƒ.Vector3.ZERO();
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.move);
                    break;
            }
        };
        move = (_event) => {
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, ƒ.Loop.timeFrameGame / 1000));
            if (this.timeToChange > ƒ.Time.game.get())
                return;
            this.timeToChange = ƒ.Time.game.get() + 1000;
            this.direction = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        };
    }
    Script.Slenderman = Slenderman;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map