"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Ball {
        //Nodes
        ballNode;
        visualizerNode;
        //Components
        ballRigid;
        visualizerMesh;
        visualizerTransform;
        visualizerMaterial;
        ballSounds;
        throwSound;
        rollingSound;
        hitSound;
        //RUNTIME VARIABLES
        ballForce = 0;
        ballRotation = 0;
        ballForceSet = false;
        ballRotationSet = false;
        countingUp = true;
        hitSoundPlayed = false;
        visualizerColor = 1;
        constructor(_ballNode) {
            this.ballNode = _ballNode;
            this.ballRigid = this.ballNode.getComponent(ƒ.ComponentRigidbody);
            this.visualizerNode = this.ballNode.getChildrenByName('Visualizer')[0];
            this.visualizerMesh = this.visualizerNode.getComponent(ƒ.ComponentMesh);
            this.visualizerTransform = this.visualizerNode.getComponent(ƒ.ComponentTransform);
            this.visualizerMaterial = this.visualizerNode.getComponent(ƒ.ComponentMaterial);
            this.ballSounds = this.ballNode.getComponents(ƒ.ComponentAudio);
            this.throwSound = this.ballSounds.find((s) => s.getAudio().name === 'Throw');
            this.rollingSound = this.ballSounds.find((s) => s.getAudio().name === 'Rolling');
            this.hitSound = this.ballSounds.find((s) => s.getAudio().name === 'Hit');
            //add event listeners
            document.addEventListener('keyup', this.handleThrow);
            document.addEventListener('keydown', this.handleInitialization);
            this.ballRigid.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.handleCollision);
        }
        update() {
            this.initializeBallProperties();
        }
        handleCollision = (_event) => {
            if (_event.cmpRigidbody.node.name.includes('Pin') &&
                !this.hitSoundPlayed) {
                this.hitSound.play(true);
                this.hitSoundPlayed = true;
            }
        };
        handleThrow = (_event) => {
            if (_event.code == ƒ.KEYBOARD_CODE.R &&
                this.ballForceSet &&
                this.ballRotationSet) {
                this.visualizerMesh.activate(false);
                this.ballRigid.applyImpulseAtPoint(new ƒ.Vector3(this.ballRotation, 0, -this.ballForce / 1));
                this.throwSound.play(true);
                this.rollingSound.play(true);
            }
        };
        handleInitialization = (_event) => {
            if (_event.code == ƒ.KEYBOARD_CODE.SPACE && !this.ballForceSet) {
                this.ballForceSet = true;
                this.visualizerMesh.activate(true);
            }
            else if (_event.code == ƒ.KEYBOARD_CODE.SPACE && this.ballForceSet) {
                this.ballRotationSet = true;
            }
            if (!this.ballForceSet) {
                //if ball hasn't been moved yet
                if (_event.code == ƒ.KEYBOARD_CODE.A) {
                    //move ball left
                    this.ballRigid.setPosition(new ƒ.Vector3(this.ballRigid.getPosition().x - 0.05, this.ballRigid.getPosition().y, this.ballRigid.getPosition().z));
                }
                else if (_event.code == ƒ.KEYBOARD_CODE.D) {
                    //move ball right
                    this.ballRigid.setPosition(new ƒ.Vector3(this.ballRigid.getPosition().x + 0.05, this.ballRigid.getPosition().y, this.ballRigid.getPosition().z));
                }
            }
        };
        initializeBallProperties() {
            if (!this.ballForceSet) {
                if (this.ballForce < 100 && this.countingUp) {
                    this.ballForce++;
                    this.visualizerTransform.mtxLocal.translateY(-0.005);
                    this.visualizerTransform.mtxLocal.scaleY(1.01);
                    this.visualizerColor = this.visualizerColor - 0.01;
                    this.visualizerMaterial.clrPrimary = new ƒ.Color(1 - this.visualizerColor, this.visualizerColor, 0, 1);
                }
                else if (this.ballForce > 0 && !this.countingUp) {
                    this.ballForce--;
                    this.visualizerTransform.mtxLocal.translateY(0.005);
                    this.visualizerTransform.mtxLocal.scaleY(0.99);
                    this.visualizerColor = this.visualizerColor + 0.01;
                    this.visualizerMaterial.clrPrimary = new ƒ.Color(1 - this.visualizerColor, this.visualizerColor, 0, 1);
                }
                if (this.ballForce >= 100 || this.ballForce <= 0) {
                    this.countingUp = !this.countingUp;
                }
                document.getElementById('ballForce').value =
                    String(this.ballForce);
            }
            else if (this.ballForceSet && !this.ballRotationSet) {
                if (this.ballRotation < 20 && this.countingUp) {
                    this.ballRotation++;
                }
                else if (this.ballRotation > -20 && !this.countingUp) {
                    this.ballRotation--;
                }
                if (this.ballRotation >= 20 || this.ballRotation <= -20) {
                    this.countingUp = !this.countingUp;
                }
                this.ballRigid.setRotation(new ƒ.Vector3(90, -this.ballRotation, 0));
                document.getElementById('ballRotation').value =
                    String(this.ballRotation);
            }
        }
    }
    Script.Ball = Ball;
})(Script || (Script = {}));
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
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        score = 0;
        constructor() {
            super();
            let domVui = document.querySelector("div#vui");
            console.log(new ƒUi.Controller(this, domVui));
        }
        reduceMutator(_mutator) {
            //
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info('Main Program Template running!');
    let viewport;
    let ballNode;
    let ball;
    let config;
    let pinPositions;
    let root;
    document.addEventListener('interactiveViewportStarted', start);
    async function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        Script.gameState = new Script.GameState();
        viewport.camera.mtxPivot.translate(new ƒ.Vector3(0, 5, -50));
        viewport.camera.mtxPivot.rotate(new ƒ.Vector3(15, 0, 0));
        setupBall();
        setupPins();
        const response = await fetch('config.json');
        config = await response.json();
        Script.gameState.score = config.score;
        ƒ.AudioManager.default.listenTo(root);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ball.update();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setupBall() {
        ballNode = root.getChildrenByName('Ball')[0];
        ball = new Script.Ball(ballNode);
    }
    function setupPins() {
        const pins = root.getChildrenByName('Pins')[0];
        pinPositions = [
            new ƒ.Vector3(0, 0.5, 0),
            new ƒ.Vector3(1, 0.5, 0),
            new ƒ.Vector3(1, 0.5, 1),
            new ƒ.Vector3(0, 0.5, 1),
            new ƒ.Vector3(-1, 0.5, 0),
            new ƒ.Vector3(0, 0.5, -1),
            new ƒ.Vector3(-1, 0.5, 1),
            new ƒ.Vector3(1, 0.5, -1),
            new ƒ.Vector3(-1, 0.5, -1),
        ];
        for (let index = 0; index < pinPositions.length; index++) {
            const position = pinPositions[index];
            pins.addChild(new Script.Pin('Pin' + (index + 1), position));
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Pin extends ƒ.Node {
        collisionCounter = 0;
        constructor(_name, _position) {
            super(_name);
            const mesh = new ƒ.MeshCube();
            const material = new ƒ.Material('MaterialPin', ƒ.ShaderGouraud);
            const cmpMesh = new ƒ.ComponentMesh(mesh);
            const cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS('green');
            const cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(0.6, 2, 0.6));
            const cmpRigidBody = new ƒ.ComponentRigidbody();
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.addComponent(cmpRigidBody);
            this.mtxLocal.translation = _position;
            //add event listeners
            cmpRigidBody.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.addScore);
        }
        addScore(_event) {
            if (!_event.cmpRigidbody.node.name.includes('Floor') && !_event.cmpRigidbody.node.name.includes('Wall')) {
                Script.gameState.score++;
            }
        }
        ;
    }
    Script.Pin = Pin;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["STAND"] = 0] = "STAND";
        JOB[JOB["HIT"] = 1] = "HIT";
        JOB[JOB["RESET"] = 2] = "RESET";
    })(JOB || (JOB = {}));
    class StateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(StateMachine);
        static instructions = StateMachine.get();
        constructor() {
            super();
            this.instructions = StateMachine.instructions;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = StateMachine.transitDefault;
            setup.setAction(JOB.STAND, this.actStand);
            setup.setAction(JOB.HIT, this.actHit);
            setup.setAction(JOB.RESET, this.actReset);
            return setup;
        }
        static transitDefault(_machine) {
            console.log('Transit to', _machine.stateNext);
        }
        static async actStand(_machine) { }
        static async actHit(_machine) { }
        static async actReset(_machine) { }
        hndEvent = (_event) => {
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.StateMachine = StateMachine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LookAtBallScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(LookAtBallScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.lookAtBall);
        };
        lookAtBall = () => {
            this.node
                .getComponent(ƒ.ComponentTransform)
                .mtxLocal.lookAt(this.node.getParent().getParent().getChildrenByName('Ball')[0]
                .mtxLocal.translation);
        };
    }
    Script.LookAtBallScript = LookAtBallScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map