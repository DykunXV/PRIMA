namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  document.addEventListener("keydown", controls);

  let viewport: ƒ.Viewport;
  let pacman: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function controls(_event: KeyboardEvent): void {
    switch (_event.code) {
      case ƒ.KEYBOARD_CODE.W:
        speed = ƒ.Vector3.Y(1/60);
        console.log("W key pressed.");
        break;
      case ƒ.KEYBOARD_CODE.S:
        speed = ƒ.Vector3.Y(-1/60);
        console.log("S key pressed.");
        break;
      case ƒ.KEYBOARD_CODE.D:
        speed = ƒ.Vector3.X(1/60);
        console.log("D key pressed.");
        break;
      case ƒ.KEYBOARD_CODE.A:
        speed = ƒ.Vector3.X(-1/60);
        console.log("A key pressed.");
        break;
      case ƒ.KEYBOARD_CODE.SPACE:
        speed = ƒ.Vector3.ZERO();
        console.log("Space key pressed.");
        break;
    }
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: ƒ.Node = viewport.getBranch();
    pacman = graph.getChildrenByName("Pacman")[0];
    console.log(pacman);
    

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    pacman.mtxLocal.translate(speed);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}