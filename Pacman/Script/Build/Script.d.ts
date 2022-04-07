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
    function createGhost(): ƒ.Node;
}
declare namespace Script {
}
declare namespace Script {
    function loadSprites(): Promise<void>;
    function setSprites(_node: ƒ.Node): void;
}
