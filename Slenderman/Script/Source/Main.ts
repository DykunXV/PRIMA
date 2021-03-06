namespace Slenderman {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let player: ƒ.Node;
  let playerCmpCam: ƒ.ComponentCamera;
  let trees: ƒ.Node;

  let speedRot: number = 0.1;
  let rotationX: number = 0;

  let ctrWalk: ƒ.Control = new ƒ.Control("ctrWalk", 1.5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let ctrRun: ƒ.Control = new ƒ.Control("ctrRun", 3, ƒ.CONTROL_TYPE.PROPORTIONAL);

  let battery: number = 1.0;

  document.addEventListener("interactiveViewportStarted", <any>start);



  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    root = viewport.getBranch();
    player = root.getChildrenByName("Player")[0];
    trees = root.getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
    initPlayerView();
    await addTrees();

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", hndPointerMove);
    canvas.requestPointerLock();
    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }



  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    controlWalk();

    viewport.draw();
    ƒ.AudioManager.default.update();
    battery -= 0.001;
    console.log(battery);
    document.querySelector("input").value = battery.toFixed(3);
  }


  function hndPointerMove(_event: PointerEvent): void {
    player.mtxLocal.rotateY(-_event.movementX * speedRot);
    rotationX += _event.movementY * speedRot;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function controlWalk(): void {
    let inputForward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrWalk.setInput(inputForward);
    player.mtxLocal.translateZ(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let inputSideways: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    ctrWalk.setInput(inputSideways);
    player.mtxLocal.translateX(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let inputRun: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.SHIFT_LEFT], [ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
    ctrRun.setInput(inputRun);
    player.mtxLocal.translateZ(ctrRun.getOutput() * ƒ.Loop.timeFrameGame / 1000);
  }

  function initPlayerView(): void {
    playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = playerCmpCam; //Active viewport camera is player view
  }

  async function addTrees(): Promise<void> {
    for (let i = 0; i < 20; i++) {
      let treeInstance = await ƒ.Project.createGraphInstance(
        ƒ.Project.resources["Graph|2022-05-03T11:32:23.947Z|52682"] as ƒ.Graph
      );
      let position: ƒ.Vector3 = new ƒ.Vector3(randomInt(-28, 28), 0, randomInt(-28, 28));
      let treeHeight = new ƒ.Vector3(1, randomInt(0.9, 1.3), 1);

      treeInstance.mtxLocal.translateX(position.x);
      treeInstance.mtxLocal.translateZ(position.z);
      treeInstance.mtxLocal.scale(treeHeight);

      trees.addChild(treeInstance);
    }
  }

  function randomInt(_min: number, _max: number): number {
    let randomNumber: number = Math.random() * (_max - _min) + _min;
    return randomNumber;
  }
}


