declare namespace Script {
    import ƒ = FudgeCore;
    class Ball {
        protected ballNode: ƒ.Node;
        protected visualizerNode: ƒ.Node;
        protected ballRigid: ƒ.ComponentRigidbody;
        protected visualizerMesh: ƒ.ComponentMesh;
        protected visualizerTransform: ƒ.ComponentTransform;
        protected visualizerMaterial: ƒ.ComponentMaterial;
        protected ballSounds: ƒ.ComponentAudio[];
        protected throwSound: ƒ.ComponentAudio;
        protected rollingSound: ƒ.ComponentAudio;
        protected hitSound: ƒ.ComponentAudio;
        protected ballForce: number;
        protected ballRotation: number;
        protected ballForceSet: boolean;
        protected ballRotationSet: boolean;
        protected countingUp: boolean;
        protected hitSoundPlayed: boolean;
        protected visualizerColor: number;
        constructor(_ballNode: ƒ.Node);
        update(): void;
        handleCollision: (_event: ƒ.EventPhysics) => void;
        handleThrow: (_event: KeyboardEvent) => void;
        handleInitialization: (_event: KeyboardEvent) => void;
        initializeBallProperties(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        score: number;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    let gameState: GameState;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Pin extends ƒ.Node {
        protected collisionCounter: number;
        constructor(_name: string, _position: ƒ.Vector3);
        addScore(_event: ƒ.EventPhysics): void;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        STAND = 0,
        HIT = 1,
        RESET = 2
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actStand;
        private static actHit;
        private static actReset;
        private hndEvent;
        private update;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class LookAtBallScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private addComponent;
        private lookAtBall;
    }
}
