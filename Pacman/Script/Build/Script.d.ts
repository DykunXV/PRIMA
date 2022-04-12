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
    import ƒ = FudgeCore;
    let direction: ƒ.Vector2;
}
declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    let spriteNode: ƒAid.NodeSprite;
    function initSprites(_node: ƒ.Node): Promise<void>;
    function loadSprites(): Promise<void>;
    function generateSprites(_spritesheet: ƒ.CoatTextured): void;
    function rotateSprite(_direction: ƒ.KEYBOARD_CODE, _directionOld: string): void;
}
