namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization

  enum JOB {
    STAND,
    HIT,
    RESET,
  }

  export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number =
      ƒ.Component.registerSubclass(StateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> =
      StateMachine.get();

    constructor() {
      super();
      this.instructions = StateMachine.instructions;

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> =
        new ƒAid.StateMachineInstructions();
      setup.transitDefault = StateMachine.transitDefault;
      setup.setAction(JOB.STAND, <ƒ.General>this.actStand);
      setup.setAction(JOB.HIT, <ƒ.General>this.actHit);
      setup.setAction(JOB.RESET, <ƒ.General>this.actReset);

      return setup;
    }

    private static transitDefault(_machine: StateMachine): void {
      console.log('Transit to', _machine.stateNext);
    }

    private static async actStand(_machine: StateMachine): Promise<void> {}

    private static async actHit(_machine: StateMachine): Promise<void> {}

    private static async actReset(_machine: StateMachine): Promise<void> {}

    private hndEvent = (_event: Event): void => {
      
    };

    private update = (_event: Event): void => {
      this.act();
    };
  }
}
