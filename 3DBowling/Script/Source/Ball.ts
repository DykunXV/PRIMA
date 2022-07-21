namespace Script {
  import ƒ = FudgeCore;

  export class Ball {
    //Nodes
    protected ballNode: ƒ.Node;
    protected visualizerNode: ƒ.Node;

    //Components
    protected ballRigid: ƒ.ComponentRigidbody;
    protected visualizerMesh: ƒ.ComponentMesh;
    protected visualizerTransform: ƒ.ComponentTransform;
    protected visualizerMaterial: ƒ.ComponentMaterial;
    protected ballSounds: ƒ.ComponentAudio[];
    protected throwSound: ƒ.ComponentAudio;
    protected rollingSound: ƒ.ComponentAudio;
    protected hitSound: ƒ.ComponentAudio;

    //RUNTIME VARIABLES
    protected ballForce: number = 0;
    protected ballRotation: number = 0;

    protected ballForceSet: boolean = false;
    protected ballRotationSet: boolean = false;

    protected countingUp: boolean = true;

    protected hitSoundPlayed: boolean = false;

    protected visualizerColor: number = 1;

    constructor(_ballNode: ƒ.Node) {
      this.ballNode = _ballNode;
      this.ballRigid = this.ballNode.getComponent(ƒ.ComponentRigidbody);

      this.visualizerNode = this.ballNode.getChildrenByName('Visualizer')[0];
      this.visualizerMesh = this.visualizerNode.getComponent(ƒ.ComponentMesh);
      this.visualizerTransform = this.visualizerNode.getComponent(
        ƒ.ComponentTransform
      );
      this.visualizerMaterial = this.visualizerNode.getComponent(
        ƒ.ComponentMaterial
      );

      this.ballSounds = this.ballNode.getComponents(ƒ.ComponentAudio);
      this.throwSound = this.ballSounds.find(
        (s) => s.getAudio().name === 'Throw'
      );
      this.rollingSound = this.ballSounds.find(
        (s) => s.getAudio().name === 'Rolling'
      );
      this.hitSound = this.ballSounds.find((s) => s.getAudio().name === 'Hit');

      //add event listeners
      document.addEventListener('keyup', this.handleThrow);
      document.addEventListener('keydown', this.handleInitialization);
      this.ballRigid.addEventListener(
        ƒ.EVENT_PHYSICS.COLLISION_ENTER,
        this.handleCollision
      );
    }

    public update(): void {
      this.initializeBallProperties();
    }

    public handleCollision = (_event: ƒ.EventPhysics): void => {
      if (
        _event.cmpRigidbody.node.name.includes('Pin') &&
        !this.hitSoundPlayed
      ) {
        this.hitSound.play(true);
        this.hitSoundPlayed = true;
      }
    };

    public handleThrow = (_event: KeyboardEvent): void => {
      if (
        _event.code == ƒ.KEYBOARD_CODE.R &&
        this.ballForceSet &&
        this.ballRotationSet
      ) {
        this.visualizerMesh.activate(false);
        this.ballRigid.applyImpulseAtPoint(
          new ƒ.Vector3(this.ballRotation, 0, -this.ballForce / 1)
        );
        this.throwSound.play(true);
        this.rollingSound.play(true);
      }
    };

    public handleInitialization = (_event: KeyboardEvent): void => {
      if (_event.code == ƒ.KEYBOARD_CODE.SPACE && !this.ballForceSet) {
        this.ballForceSet = true;
        this.visualizerMesh.activate(true);
      } else if (_event.code == ƒ.KEYBOARD_CODE.SPACE && this.ballForceSet) {
        this.ballRotationSet = true;
      }

      if (!this.ballForceSet) {
        //if ball hasn't been moved yet
        if (_event.code == ƒ.KEYBOARD_CODE.A) {
          //move ball left
          this.ballRigid.setPosition(
            new ƒ.Vector3(
              this.ballRigid.getPosition().x - 0.05,
              this.ballRigid.getPosition().y,
              this.ballRigid.getPosition().z
            )
          );
        } else if (_event.code == ƒ.KEYBOARD_CODE.D) {
          //move ball right
          this.ballRigid.setPosition(
            new ƒ.Vector3(
              this.ballRigid.getPosition().x + 0.05,
              this.ballRigid.getPosition().y,
              this.ballRigid.getPosition().z
            )
          );
        }
      }
    };

    public initializeBallProperties(): void {
      if (!this.ballForceSet) {
        if (this.ballForce < 100 && this.countingUp) {
          this.ballForce++;
          this.visualizerTransform.mtxLocal.translateY(-0.005);
          this.visualizerTransform.mtxLocal.scaleY(1.01);
          this.visualizerColor = this.visualizerColor - 0.01;
          this.visualizerMaterial.clrPrimary = new ƒ.Color(
            1 - this.visualizerColor,
            this.visualizerColor,
            0,
            1
          );
        } else if (this.ballForce > 0 && !this.countingUp) {
          this.ballForce--;
          this.visualizerTransform.mtxLocal.translateY(0.005);
          this.visualizerTransform.mtxLocal.scaleY(0.99);
          this.visualizerColor = this.visualizerColor + 0.01;
          this.visualizerMaterial.clrPrimary = new ƒ.Color(
            1 - this.visualizerColor,
            this.visualizerColor,
            0,
            1
          );
        }

        if (this.ballForce >= 100 || this.ballForce <= 0) {
          this.countingUp = !this.countingUp;
        }

        (document.getElementById('ballForce') as HTMLInputElement).value =
          String(this.ballForce);
      } else if (this.ballForceSet && !this.ballRotationSet) {
        if (this.ballRotation < 20 && this.countingUp) {
          this.ballRotation++;
        } else if (this.ballRotation > -20 && !this.countingUp) {
          this.ballRotation--;
        }

        if (this.ballRotation >= 20 || this.ballRotation <= -20) {
          this.countingUp = !this.countingUp;
        }

        this.ballRigid.setRotation(new ƒ.Vector3(90, -this.ballRotation, 0));
        (document.getElementById('ballRotation') as HTMLInputElement).value =
          String(this.ballRotation);
      }
    }
  }
}
