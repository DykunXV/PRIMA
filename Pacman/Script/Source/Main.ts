namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Node;
  let viewport: ƒ.Viewport;
  let pacman: ƒ.Node;
  let grid: ƒ.Node;
  let direction: ƒ.Vector2 = ƒ.Vector2.ZERO();
  let directionOldString: string = 'right';
  let speed: number = 0.05;
  let startSound: ƒ.ComponentAudio;
  let waka: ƒ.ComponentAudio;

  let ghost: ƒ.Node;

  document.addEventListener("interactiveViewportStarted", <any>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(10);
    viewport.camera.mtxPivot.rotateY(180);

    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("Pacman")[0];
    await initSprites(pacman);
    grid = graph.getChildrenByName("Grid")[0];

    ghost = Ghost.createGhost();
    graph.addChild(ghost);

    ƒ.AudioManager.default.listenTo(graph);
    startSound = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[0];
    startSound.play(true);
    waka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    let posPacman: ƒ.Vector3 = pacman.mtxLocal.translation;
    let nearestGridPoint: ƒ.Vector2 = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
    let nearGridPoint: boolean = posPacman.toVector2().equals(nearestGridPoint, 2 * speed);

    if (nearGridPoint) {
      let directionOld: ƒ.Vector2 = direction.clone;
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
        direction.set(1, 0);
        rotateSprite(ƒ.KEYBOARD_CODE.ARROW_RIGHT, directionOldString);
        directionOldString = 'right'
      }
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
        direction.set(-1, 0);
        rotateSprite(ƒ.KEYBOARD_CODE.ARROW_LEFT, directionOldString);
        directionOldString = 'left'
      }
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])){
        direction.set(0, 1);
        rotateSprite(ƒ.KEYBOARD_CODE.ARROW_UP, directionOldString);
        directionOldString = 'up'
      }
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])){
        direction.set(0, -1);
        rotateSprite(ƒ.KEYBOARD_CODE.ARROW_DOWN, directionOldString);
        directionOldString = 'down'
      }
        


      if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
        if (direction.equals(directionOld)) // did not turn
          direction.set(0, 0); // full stop
        else {
          if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
            direction.set(0, 0); // full stop
          else
            direction = directionOld; // don't turn but continue ahead
        }

      if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
        pacman.mtxLocal.translation = nearestGridPoint.toVector3();

      if (direction.equals(ƒ.Vector2.ZERO()))
        waka.play(false);
      else if (!waka.isPlaying)
        waka.play(true);

    }

    pacman.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed).toVector3());
    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  function blocked(_posCheck: ƒ.Vector2): boolean {
    let check: ƒ.Node = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
    return (!check || check.name == "Wall");
  }
}