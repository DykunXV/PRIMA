namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export function createGhost(): ƒ.Node {
    let node: ƒ.Node = new ƒ.Node('Ghost');

    let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
    let material: ƒ.Material = new ƒ.Material(
      'MaterialGhost',
      ƒ.ShaderLit,
      new ƒ.CoatColored()
    );

    let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

    cmpMaterial.clrPrimary = ƒ.Color.CSS('red');

    node.addComponent(cmpTransform);
    node.addComponent(cmpMesh);
    node.addComponent(cmpMaterial);

    node.mtxLocal.translateX(2);
    cmpTransform.mtxLocal.translateY(1); //alternative to "node.mtxLocal.translateY(1)"

    return node;
  }
}
