namespace Slenderman {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class GameState extends ƒ.Mutable {
        private static controller: ƒUi.Controller;
        public battery: number = 1;

        private constructor() {
            super();
            let domVui: HTMLDivElement = document.querySelector("div#vui");
            console.log(new ƒUi.Controller(this, domVui));
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }
    }
}