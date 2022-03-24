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
    None = 'NONE',
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
  }

  let currentWalkingDirection = 'NONE';
  let newWalkingDirection = 'NONE';

  document.addEventListener('interactiveViewportStarted', <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: ƒ.Node = viewport.getBranch();
    pacman = graph.getChildrenByName('Pacman')[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function isNextTileWall(walkingDirection: string): boolean {
    let graph: ƒ.Node = viewport.getBranch();
    grid = graph.getChildrenByName('Grid')[0];

    switch (walkingDirection) {
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

  function setNewWalkingDirection(): void {
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])
    ) {
      newWalkingDirection = WalkingDirections.Left;
    }
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])
    ) {
      newWalkingDirection = WalkingDirections.Right;
    }
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])
    ) {
      newWalkingDirection = WalkingDirections.Up;
    }
    if (
      ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])
    ) {
      newWalkingDirection = WalkingDirections.Down;
    }
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    setNewWalkingDirection();

    console.log(pacman.mtxLocal.translation.y)

    if (
      newWalkingDirection == 'RIGHT' &&
      pacman.mtxLocal.translation.y % 1 < 0.05 &&
      isNextTileWall(newWalkingDirection) == false
    ) {
      currentWalkingDirection = WalkingDirections.Right;
      speed = new ƒ.Vector3(1 / 60, 0, 0);
    }
    if (
      newWalkingDirection == 'LEFT' &&
      pacman.mtxLocal.translation.y % 1 < 0.05 &&
      isNextTileWall(newWalkingDirection) == false
    ) {
      currentWalkingDirection = WalkingDirections.Left;
      
      speed = new ƒ.Vector3(-1 / 60, 0, 0);
    }
    if (
      newWalkingDirection == 'UP' &&
      pacman.mtxLocal.translation.x % 1 < 0.05 &&
      isNextTileWall(newWalkingDirection) == false
    ) {
      currentWalkingDirection = WalkingDirections.Up;
      speed = new ƒ.Vector3(0, 1 / 60, 0);
    }
    if (
      newWalkingDirection == 'DOWN' &&
      pacman.mtxLocal.translation.x % 1 < 0.05 &&
      isNextTileWall(newWalkingDirection) == false
    ) {
      currentWalkingDirection = WalkingDirections.Down;
      speed = new ƒ.Vector3(0, -1 / 60, 0);
    }

    if (pacman.mtxLocal.translation.y >= pacmanCurrentY + 1) {
      pacmanCurrentY += 1;
      console.log('Y: ' + pacmanCurrentY);
    }

    if (pacman.mtxLocal.translation.y <= pacmanCurrentY - 1) {
      pacmanCurrentY -= 1;
      console.log('Y: ' + pacmanCurrentY);
    }

    if (pacman.mtxLocal.translation.x >= pacmanCurrentX + 1) {
      pacmanCurrentX += 1;
      
      console.log('X: ' + pacmanCurrentX);
    }

    if (pacman.mtxLocal.translation.x <= pacmanCurrentX - 1) {
      pacmanCurrentX -= 1;
      
      console.log('X: ' + pacmanCurrentX);
    }
    
    if (isNextTileWall(currentWalkingDirection)) {
      speed = new ƒ.Vector3(0, 0, 0);
    }

    pacman.mtxLocal.translate(speed);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
