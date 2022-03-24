"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
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
                    ƒ.Debug.log(this.message, this.node);
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
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info('Main Program Template running!');
    let viewport;
    let pacman;
    let grid;
    let nextRow;
    let nextRowTile;
    let speed = new ƒ.Vector3(0, 0, 0);
    let pacmanCurrentX = 1;
    let pacmanCurrentY = 1;
    let WalkingDirections;
    (function (WalkingDirections) {
        WalkingDirections["Up"] = "UP";
        WalkingDirections["Down"] = "DOWN";
        WalkingDirections["Left"] = "LEFT";
        WalkingDirections["Right"] = "RIGHT";
    })(WalkingDirections || (WalkingDirections = {}));
    let currentWalkingDirection = 'NONE';
    document.addEventListener('interactiveViewportStarted', start);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        pacman = graph.getChildrenByName('Pacman')[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function isNextTileWall() {
        let graph = viewport.getBranch();
        grid = graph.getChildrenByName('Grid')[0];
        switch (currentWalkingDirection) {
            case 'LEFT':
                nextRow = grid.getChildren()[pacmanCurrentY];
                nextRowTile = nextRow.getChildren()[pacmanCurrentX - 1];
                if (nextRowTile.name == 'Wall') {
                    return true;
                }
                else {
                    return false;
                }
            case 'RIGHT':
                nextRow = grid.getChildren()[pacmanCurrentY];
                nextRowTile = nextRow.getChildren()[pacmanCurrentX + 1];
                if (nextRowTile.name == 'Wall') {
                    return true;
                }
                else {
                    return false;
                }
            case 'UP':
                nextRow = grid.getChildren()[pacmanCurrentY + 1];
                nextRowTile = nextRow.getChildren()[pacmanCurrentX];
                if (nextRowTile.name == 'Wall') {
                    return true;
                }
                else {
                    return false;
                }
            case 'DOWN':
                nextRow = grid.getChildren()[pacmanCurrentY - 1];
                nextRowTile = nextRow.getChildren()[pacmanCurrentX];
                if (nextRowTile.name == 'Wall') {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return false;
        }
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([
            ƒ.KEYBOARD_CODE.ARROW_RIGHT,
            ƒ.KEYBOARD_CODE.D,
        ]) &&
            pacman.mtxLocal.translation.y % 1 < 0.05) {
            currentWalkingDirection = WalkingDirections.Right;
            speed = new ƒ.Vector3(1 / 60, 0, 0);
        }
        if (ƒ.Keyboard.isPressedOne([
            ƒ.KEYBOARD_CODE.ARROW_LEFT,
            ƒ.KEYBOARD_CODE.A,
        ]) &&
            pacman.mtxLocal.translation.y % 1 < 0.05) {
            currentWalkingDirection = WalkingDirections.Left;
            speed = new ƒ.Vector3(-1 / 60, 0, 0);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) &&
            pacman.mtxLocal.translation.x % 1 < 0.05) {
            currentWalkingDirection = WalkingDirections.Up;
            speed = new ƒ.Vector3(0, 1 / 60, 0);
        }
        if (ƒ.Keyboard.isPressedOne([
            ƒ.KEYBOARD_CODE.ARROW_DOWN,
            ƒ.KEYBOARD_CODE.S,
        ]) &&
            pacman.mtxLocal.translation.x % 1 < 0.05) {
            currentWalkingDirection = WalkingDirections.Down;
            speed = new ƒ.Vector3(0, -1 / 60, 0);
        }
        if (pacman.mtxLocal.translation.y >= pacmanCurrentY + 0.95) {
            pacmanCurrentY += 1;
            console.log(pacmanCurrentY);
            isNextTileWall();
        }
        if (pacman.mtxLocal.translation.y <= pacmanCurrentY - 0.95) {
            pacmanCurrentY -= 1;
            console.log(pacmanCurrentY);
            isNextTileWall();
        }
        if (pacman.mtxLocal.translation.x >= pacmanCurrentX + 0.95) {
            pacmanCurrentX += 1;
            console.log(pacmanCurrentX);
            isNextTileWall();
        }
        if (pacman.mtxLocal.translation.x <= pacmanCurrentX - 0.95) {
            pacmanCurrentX -= 1;
            console.log(pacmanCurrentX);
            isNextTileWall();
        }
        if (isNextTileWall()) {
            speed = new ƒ.Vector3(0, 0, 0);
        }
        //console.log(pacman.mtxLocal.translation.get()[0]);
        pacman.mtxLocal.translate(speed);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map