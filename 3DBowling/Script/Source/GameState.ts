namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {

    public score: number = 0;

    public constructor() {
        super();
        let domVui: HTMLDivElement = document.querySelector("div#vui");
        console.log(new ƒUi.Controller(this, domVui));
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {
      //
    }
  }
}
