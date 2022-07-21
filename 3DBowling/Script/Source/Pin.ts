namespace Script {
  import ƒ = FudgeCore;

  export class Pin extends ƒ.Node {
    protected collisionCounter: number = 0;

    constructor(_name: string, _position: ƒ.Vector3) {
      super(_name);

      const mesh: ƒ.MeshCube = new ƒ.MeshCube();
      const material: ƒ.Material = new ƒ.Material(
        'MaterialPin',
        ƒ.ShaderGouraud,
      );

      const cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);

      const cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(
        material
      );
      cmpMaterial.clrPrimary = ƒ.Color.CSS('green');

      const cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
      cmpTransform.mtxLocal.scale(new ƒ.Vector3(0.6, 2, 0.6));

      const cmpRigidBody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();

      this.addComponent(cmpMesh);
      this.addComponent(cmpMaterial);
      this.addComponent(cmpTransform);
      this.addComponent(cmpRigidBody);

      this.mtxLocal.translation = _position;

      //add event listeners
      cmpRigidBody.addEventListener(
        ƒ.EVENT_PHYSICS.COLLISION_ENTER,
        this.addScore
      );
    }

    public addScore(_event: ƒ.EventPhysics): void {
      if (!_event.cmpRigidbody.node.name.includes('Floor') && !_event.cmpRigidbody.node.name.includes('Wall')) {
        gameState.score++;
      }
    };

    
    
  }
}
