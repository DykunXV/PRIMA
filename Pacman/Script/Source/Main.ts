namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info('Main Program Template running!');

  let viewport: ƒ.Viewport;
  let pacman: ƒ.Node;
  let grid: ƒ.Node;
  let nextRow: ƒ.Node;
  let nextRowTile: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  let pacmanCurrentX: number = 1;
  let pacmanCurrentY: number = 1;
  enum WalkingDirections {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
  }

  let currentWalkingDirection = 'NONE';

  document.addEventListener('interactiveViewportStarted', <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: ƒ.Node = viewport.getBranch();
    pacman = graph.getChildrenByName('Pacman')[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function isNextTileWall(): boolean {
    let graph: ƒ.Node = viewport.getBranch();
    grid = graph.getChildrenByName('Grid')[0];

    switch (currentWalkingDirection) {
      case 'LEFT':
        nextRow = grid.getChildren()[pacmanCurrentY];
        nextRowTile = nextRow.getChildren()[pacmanCurrentX - 1];
        if (nextRowTile.name == 'Wall') {
          return true;
        } else {
          return false;
        }
      case 'RIGHT':
        nextRow = grid.getChildren()[pacmanCurrentY];
        nextRowTile = nextRow.getChildren()[pacmanCurrentX + 1];
        if (nextRowTile.name == 'Wall') {
          return true;
        } else {
          return false;
        }
      case 'UP':
        nextRow = grid.getChildren()[pacmanCurrentY + 1];
        nextRowTile = nextRow.getChildren()[pacmanCurrentX];
        if (nextRowTile.name == 'Wall') {
          return true;
        } else {
          return false;
        }
      case 'DOWN':
        nextRow = grid.getChildren()[pacmanCurrentY - 1];
        nextRowTile = nextRow.getChildren()[pacmanCurrentX];
        if (nextRowTile.name == 'Wall') {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    if (
      ƒ.Keyboard.isPressedOne([
        ƒ.KEYBOARD_CODE.ARROW_RIGHT,
        ƒ.KEYBOARD_CODE.D,
      ]) &&
      pacman.mtxLocal.translation.y % 1 < 0.05
    ) {
      currentWalkingDirection = WalkingDirections.Right;
      speed = new ƒ.Vector3(1 / 60, 0, 0);
    }
    if (
      ƒ.Keyboard.isPressedOne([
        ƒ.KEYBOARD_CODE.ARROW_LEFT,
        ƒ.KEYBOARD_CODE.A,
      ]) &&
      pacman.mtxLocal.translation.y % 1 < 0.05
    ) {
      currentWalkingDirection = WalkingDirections.Left;
      speed = new ƒ.Vector3(-1 / 60, 0, 0);
    }
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) &&
      pacman.mtxLocal.translation.x % 1 < 0.05
    ) {
      currentWalkingDirection = WalkingDirections.Up;
      speed = new ƒ.Vector3(0, 1 / 60, 0);
    }
    if (
      ƒ.Keyboard.isPressedOne([
        ƒ.KEYBOARD_CODE.ARROW_DOWN,
        ƒ.KEYBOARD_CODE.S,
      ]) &&
      pacman.mtxLocal.translation.x % 1 < 0.05
    ) {
      currentWalkingDirection = WalkingDirections.Down;
      speed = new ƒ.Vector3(0, -1 / 60, 0);
    }

    if (pacman.mtxLocal.translation.y >= pacmanCurrentY + 0.95) {
      pacmanCurrentY += 1;
      console.log(pacmanCurrentY);
      isNextTileWall();
    }

    if (pacman.mtxLocal.translation.y <= pacmanCurrentY - 0.95) {
      pacmanCurrentY -= 1;
      console.log(pacmanCurrentY);
      isNextTileWall();
    }

    if (pacman.mtxLocal.translation.x >= pacmanCurrentX + 0.95) {
      pacmanCurrentX += 1;
      console.log(pacmanCurrentX);
      isNextTileWall();
    }

    if (pacman.mtxLocal.translation.x <= pacmanCurrentX - 0.95) {
      pacmanCurrentX -= 1;
      console.log(pacmanCurrentX);
      isNextTileWall();
    }

    if (isNextTileWall()) {
      speed = new ƒ.Vector3(0, 0, 0);
    }

    //console.log(pacman.mtxLocal.translation.get()[0]);

    pacman.mtxLocal.translate(speed);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
