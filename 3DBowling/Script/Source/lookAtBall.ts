namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization

  export class LookAtBallScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number =
      ƒ.Component.registerSubclass(LookAtBallScript);
    // Properties may be mutated by users in the editor via the automatically created user interface

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
    }

    private addComponent = (): void => {
      this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.lookAtBall);
    };

    private lookAtBall = (): void => {
      this.node
        .getComponent(ƒ.ComponentTransform)
        .mtxLocal.lookAt(
          this.node.getParent().getParent().getChildrenByName('Ball')[0]
            .mtxLocal.translation
        );
    };
  }
}
