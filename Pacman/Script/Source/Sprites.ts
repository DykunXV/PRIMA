namespace Script {
  import ƒAid = FudgeAid;

  let animationsPacman: ƒAid.SpriteSheetAnimations;
  let spritesPacman: ƒAid.NodeSprite;
  const clrWhite: ƒ.Color = ƒ.Color.CSS('white');

  export async function loadSprites(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load('Images/texture.png');

    let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(
      clrWhite,
      imgSpriteSheet
    );
    generateSprites(spriteSheet);
  }

  function generateSprites(_spritesheet: ƒ.CoatTextured): void {
    animationsPacman = {};
    this.animations = {};
    let name: string = 'move';
    let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(
      name,
      _spritesheet
    );
    sprite.generateByGrid(
      ƒ.Rectangle.GET(0, 0, 64, 64),
      8,
      64,
      ƒ.ORIGIN2D.BOTTOMCENTER,
      ƒ.Vector2.X(64)
    );
    animationsPacman[name] = sprite;
  }

  export function setSprites(_node: ƒ.Node): void {
    spritesPacman = new ƒAid.NodeSprite("Sprite");
    spritesPacman.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spritesPacman.setAnimation(<ƒAid.SpriteSheetAnimation>animationsPacman["move"]);
    spritesPacman.setFrameDirection(1);
    spritesPacman.mtxLocal.translateZ(0.5);
    spritesPacman.framerate = 15;

    _node.addChild(spritesPacman);
    _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    spritesPacman.mtxLocal.rotateZ(90);
  }
}
