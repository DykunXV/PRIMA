namespace Slenderman {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let player: ƒ.Node;
  let playerCmpCam: ƒ.ComponentCamera;

  let speedRot: number = 0.1;
  let rotationX: number = 0;

  let playerWalkControl: ƒ.Control = new ƒ.Control("playerWalkControl", 1.5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let playerRunControl: ƒ.Control = new ƒ.Control("playerRunControl", 3, ƒ.CONTROL_TYPE.PROPORTIONAL);

  let slenderman: ƒ.Node;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);



  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    root = viewport.getBranch();
    player = root.getChildrenByName("Player")[0];
    slenderman = root.getChildrenByName("Slenderman")[0];
    playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = playerCmpCam; //Active viewport camera is player view

    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    playerControl();

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndPointerMove(_event: PointerEvent): void {
    player.mtxLocal.rotateY(-_event.movementX * speedRot);
    rotationX += _event.movementY * speedRot;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function playerControl(): void {
    let inputForward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    playerWalkControl.setInput(inputForward);
    player.mtxLocal.translateZ(playerWalkControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let inputSideways: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    playerWalkControl.setInput(inputSideways);
    player.mtxLocal.translateX(playerWalkControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    /*
    let inputRun: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.SHIFT_LEFT], [ƒ.KEYBOARD_CODE.ALT_LEFT]);
    playerRunControl.setInput(inputRun);
    player.mtxLocal.translateZ(playerRunControl.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    */
  }
}

