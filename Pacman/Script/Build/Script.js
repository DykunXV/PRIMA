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
    class Ghost extends ƒ.Node {
        direction = ƒ.Vector2.ZERO();
        speed = 0.05;
        move() {
            //movestuff
        }
        static createGhost() {
            let node = new ƒ.Node('Ghost');
            let mesh = new ƒ.MeshSphere();
            let material = new ƒ.Material('MaterialGhost', ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpTransform = new ƒ.ComponentTransform();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS('red');
            node.addComponent(cmpTransform);
            node.addComponent(cmpMesh);
            node.addComponent(cmpMaterial);
            node.mtxLocal.translateX(2);
            cmpTransform.mtxLocal.translateY(1); //alternative to "node.mtxLocal.translateY(1)"
            return node;
        }
        static createGhosts() {
            let ghosts = new ƒ.Node('Ghosts');
            for (let i = 0; i < 3; i++)
                ghosts.appendChild(new Ghost('Ghost'));
            return ghosts;
        }
    }
    Script.Ghost = Ghost;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let pacman;
    let grid;
    let direction = ƒ.Vector2.ZERO();
    let speed = 0.05;
    let waka;
    let ghost;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        console.log(viewport.camera);
        viewport.camera.mtxPivot.translateZ(10);
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateX(-2);
        viewport.camera.mtxPivot.translateY(2);
        let graph = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        grid = graph.getChildrenByName("Grid")[0];
        console.log(pacman);
        ghost = Script.Ghost.createGhost();
        graph.addChild(ghost); //add enemies to map
        ƒ.AudioManager.default.listenTo(graph);
        waka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        let posPacman = pacman.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);
        if (nearGridPoint) {
            let directionOld = direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                direction.set(1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                direction.set(-1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                direction.set(0, 1);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                direction.set(0, -1);
            if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
                if (direction.equals(directionOld)) // did not turn
                    direction.set(0, 0); // full stop
                else {
                    if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
                        direction.set(0, 0); // full stop
                    else
                        direction = directionOld; // don't turn but continue ahead
                }
            if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
                pacman.mtxLocal.translation = nearestGridPoint.toVector3();
            if (direction.equals(ƒ.Vector2.ZERO()))
                waka.play(false);
            else if (!waka.isPlaying)
                waka.play(true);
        }
        pacman.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed).toVector3());
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    function blocked(_posCheck) {
        let check = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
        return (!check || check.name == "Wall");
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒAid = FudgeAid;
    let animationsPacman;
    let spritesPacman;
    const clrWhite = ƒ.Color.CSS('white');
    async function loadSprites() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load('Images/texture.png');
        let spriteSheet = new ƒ.CoatTextured(clrWhite, imgSpriteSheet);
        generateSprites(spriteSheet);
    }
    Script.loadSprites = loadSprites;
    function generateSprites(_spritesheet) {
        animationsPacman = {};
        this.animations = {};
        let name = 'move';
        let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(64));
        animationsPacman[name] = sprite;
    }
    function setSprites(_node) {
        spritesPacman = new ƒAid.NodeSprite("Sprite");
        spritesPacman.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spritesPacman.setAnimation(animationsPacman["move"]);
        spritesPacman.setFrameDirection(1);
        spritesPacman.mtxLocal.translateZ(0.5);
        spritesPacman.framerate = 15;
        _node.addChild(spritesPacman);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        spritesPacman.mtxLocal.rotateZ(90);
    }
    Script.setSprites = setSprites;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map