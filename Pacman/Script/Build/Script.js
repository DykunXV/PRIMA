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
    let graph;
    let viewport;
    let pacman;
    let grid;
    Script.direction = ƒ.Vector2.ZERO();
    let directionOldString = 'right';
    let speed = 0.05;
    let startSound;
    let waka;
    let ghost;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translateZ(10);
        viewport.camera.mtxPivot.rotateY(180);
        graph = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        await Script.initSprites(pacman);
        grid = graph.getChildrenByName("Grid")[0];
        ghost = Script.Ghost.createGhost();
        graph.addChild(ghost);
        ƒ.AudioManager.default.listenTo(graph);
        startSound = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[0];
        startSound.play(true);
        waka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        let posPacman = pacman.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);
        if (nearGridPoint) {
            let directionOld = Script.direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
                Script.direction.set(1, 0);
                Script.rotateSprite(ƒ.KEYBOARD_CODE.ARROW_RIGHT, directionOldString);
                directionOldString = 'right';
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                Script.direction.set(-1, 0);
                Script.rotateSprite(ƒ.KEYBOARD_CODE.ARROW_LEFT, directionOldString);
                directionOldString = 'left';
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
                Script.direction.set(0, 1);
                Script.rotateSprite(ƒ.KEYBOARD_CODE.ARROW_UP, directionOldString);
                directionOldString = 'up';
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
                Script.direction.set(0, -1);
                Script.rotateSprite(ƒ.KEYBOARD_CODE.ARROW_DOWN, directionOldString);
                directionOldString = 'down';
            }
            if (blocked(ƒ.Vector2.SUM(nearestGridPoint, Script.direction)))
                if (Script.direction.equals(directionOld)) // did not turn
                    Script.direction.set(0, 0); // full stop
                else {
                    if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
                        Script.direction.set(0, 0); // full stop
                    else
                        Script.direction = directionOld; // don't turn but continue ahead
                }
            if (!Script.direction.equals(directionOld) || Script.direction.equals(ƒ.Vector2.ZERO()))
                pacman.mtxLocal.translation = nearestGridPoint.toVector3();
            if (Script.direction.equals(ƒ.Vector2.ZERO()))
                waka.play(false);
            else if (!waka.isPlaying)
                waka.play(true);
        }
        pacman.mtxLocal.translate(ƒ.Vector2.SCALE(Script.direction, speed).toVector3());
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
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let spriteAnimations;
    async function initSprites(_node) {
        await loadSprites();
        Script.spriteNode = new ƒAid.NodeSprite('Sprite');
        Script.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        Script.spriteNode.setAnimation(spriteAnimations['Pacman']);
        Script.spriteNode.setFrameDirection(1);
        Script.spriteNode.mtxLocal.translateY(0);
        Script.spriteNode.framerate = 15;
        _node.addChild(Script.spriteNode);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Script.initSprites = initSprites;
    async function loadSprites() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load('Images/texture.png');
        let spriteSheet = new ƒ.CoatTextured(new ƒ.Color(), imgSpriteSheet);
        generateSprites(spriteSheet);
    }
    Script.loadSprites = loadSprites;
    function generateSprites(_spritesheet) {
        spriteAnimations = {};
        let name = 'Pacman';
        let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 6, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        spriteAnimations[name] = sprite;
    }
    Script.generateSprites = generateSprites;
    function rotateSprite(_direction, _directionOld) {
        if ((_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'down') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'right') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'left') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'up')) {
            Script.spriteNode.mtxLocal.rotateZ(90);
        }
        else if ((_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'up') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'left') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'right') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'down')) {
            Script.spriteNode.mtxLocal.rotateZ(-90);
        }
        else if ((_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'left') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'down') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'up') ||
            (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'right')) {
            Script.spriteNode.mtxLocal.rotateZ(180);
        }
    }
    Script.rotateSprite = rotateSprite;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map