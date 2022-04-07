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
    class Ghost extends ƒ.Node {
        direction: ƒ.Vector2;
        speed: number;
        move(): void;
        static createGhost(): ƒ.Node;
        static createGhosts(): ƒ.Node;
    }
}
declare namespace Script {
}
declare namespace Script {
    function loadSprites(): Promise<void>;
    function setSprites(_node: ƒ.Node): void;
}
