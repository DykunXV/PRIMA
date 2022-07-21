namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info('Main Program Template running!');

  interface Config {
    score: 0;
  }

  let viewport: ƒ.Viewport;

  let ballNode: ƒ.Node;
  let ball: Ball;

  let config: Config;

  let pinPositions: ƒ.Vector3[];

  let root: ƒ.Node;

  export let gameState: GameState;

  document.addEventListener(
    'interactiveViewportStarted',
    <EventListener>(<unknown>start)
  );

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    root = viewport.getBranch();

    gameState = new GameState();

    viewport.camera.mtxPivot.translate(new ƒ.Vector3(0, 5, -50))
    viewport.camera.mtxPivot.rotate(new ƒ.Vector3(15, 0, 0))

    setupBall();
    setupPins();

    const response: Response = await fetch('config.json');
    config = await response.json();
    gameState.score = config.score;

    ƒ.AudioManager.default.listenTo(root);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ball.update();
    ƒ.Physics.simulate(); // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setupBall(): void {
    ballNode = root.getChildrenByName('Ball')[0];
    ball = new Ball(ballNode);
  }

  function setupPins() {
    const pins: ƒ.Node = root.getChildrenByName('Pins')[0];

    pinPositions = [
      new ƒ.Vector3(0, 0.5, 0),
      new ƒ.Vector3(1, 0.5, 0),
      new ƒ.Vector3(1, 0.5, 1),
      new ƒ.Vector3(0, 0.5, 1),
      new ƒ.Vector3(-1, 0.5, 0),
      new ƒ.Vector3(0, 0.5, -1),
      new ƒ.Vector3(-1, 0.5, 1),
      new ƒ.Vector3(1, 0.5, -1),
      new ƒ.Vector3(-1, 0.5, -1),
    ];

    for (let index = 0; index < pinPositions.length; index++) {
      const position = pinPositions[index];

      pins.addChild(new Pin('Pin' + (index + 1), position));
    }
  }
}
