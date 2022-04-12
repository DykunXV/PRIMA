namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  let spriteAnimations: ƒAid.SpriteSheetAnimations;
  export let spriteNode: ƒAid.NodeSprite;

  export async function initSprites(_node: ƒ.Node): Promise<void> {
    await loadSprites();
    spriteNode = new ƒAid.NodeSprite('Sprite');
    spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spriteNode.setAnimation(
      <ƒAid.SpriteSheetAnimation>spriteAnimations['Pacman']
    );
    spriteNode.setFrameDirection(1);
    spriteNode.mtxLocal.translateY(0);
    spriteNode.framerate = 15;

    _node.addChild(spriteNode);
    _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(
      0,
      0,
      0,
      0
    );
  }

  export async function loadSprites(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load('Images/texture.png');
    let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(
      new ƒ.Color(),
      imgSpriteSheet
    );
    generateSprites(spriteSheet);
  }

  export function generateSprites(_spritesheet: ƒ.CoatTextured): void {
    spriteAnimations = {};
    let name: string = 'Pacman';
    let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(
      name,
      _spritesheet
    );
    sprite.generateByGrid(
      ƒ.Rectangle.GET(0, 0, 64, 64),
      6,
      70,
      ƒ.ORIGIN2D.CENTER,
      ƒ.Vector2.X(64)
    );
    spriteAnimations[name] = sprite;
  }

  export function rotateSprite(_direction: ƒ.KEYBOARD_CODE, _directionOld: string): void {
    if (_direction !== _directionOld) {
      if (
        (_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'down') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'right') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'left') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'up')
      ) {
        spriteNode.mtxLocal.rotateZ(90);
      } else if (
        (_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'ip') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'left') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'right') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'down')
      ) {
        spriteNode.mtxLocal.rotateZ(-90);
      } else if (
        (_direction === ƒ.KEYBOARD_CODE.ARROW_RIGHT && _directionOld === 'left') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_UP && _directionOld === 'down') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_DOWN && _directionOld === 'up') ||
        (_direction === ƒ.KEYBOARD_CODE.ARROW_LEFT && _directionOld === 'down')
      ) {
        spriteNode.mtxLocal.rotateZ(180);
      }
    }
  }
}
