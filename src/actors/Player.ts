import {
  Actor,
  Engine,
  Vector,
  Color,
  Animation,
  CollisionType,
  CollisionStartEvent,
  Keys,
  Buttons,
  Axes,
  Shape,
} from "excalibur";
import { Resources } from "../resources";
import { Ghost } from "./Ghost";
import { CollectibleItem } from "./Item";
import { GameplayScene } from "../scenes/GameplayScene";
import * as state from "../gameState";

export class Player extends Actor {
  public static instance: Player | null = null;
  public isOnGround = true;
  private landSquashTimer = 0;
  private gameScene: GameplayScene;

  constructor(scene: GameplayScene) {
    super({
      pos: new Vector(50, 443),
      collider: Shape.Circle(7.5, new Vector(0, -7.5)),
      anchor: new Vector(0.5, 1),
      scale: new Vector(2, 2),
      collisionType: CollisionType.Active,
    });
    Player.instance = this;
    this.gameScene = scene;
  }

  onInitialize(engine: Engine): void {
    const runAnimation = new Animation({
      frames: [
        { graphic: Resources.pacmanClosed.toSprite() },
        { graphic: Resources.pacmanHalf.toSprite() },
        { graphic: Resources.pacmanOpen.toSprite() },
      ],
      frameDuration: 80,
    });
    this.graphics.add("run", runAnimation);
    this.graphics.use("run");

    this.on("collisionstart", (event: CollisionStartEvent) => {
      const actor = event.other.owner;
      if (actor instanceof Ghost) this.handleGhostCollision(actor);
      if (actor instanceof CollectibleItem)
        this.handleItemCollision(actor, engine);
    });
  }

  update(engine: Engine) {
    const keyboard = engine.input.keyboard;
    const pad = (engine as any).mygamepad;

    const isJumpingPad =
      pad &&
      (pad.isButtonPressed(Buttons.Face3) ||
        pad.isButtonPressed(Buttons.Face4) ||
        pad.isButtonPressed(Buttons.LeftBumper) ||
        pad.isButtonPressed(Buttons.RightBumper) ||
        pad.isButtonPressed(Buttons.DpadUp) ||
        pad.getAxes(Axes.LeftStickY) < -0.5);

    const isJumping = keyboard.isHeld(Keys.ArrowUp) || isJumpingPad;

    const isDuckingPad =
      pad &&
      (pad.isButtonPressed(Buttons.Face1) ||
        pad.isButtonPressed(Buttons.Face2) ||
        pad.isButtonPressed(Buttons.LeftTrigger) ||
        pad.isButtonPressed(Buttons.RightTrigger) ||
        pad.isButtonPressed(Buttons.DpadDown) ||
        pad.getAxes(Axes.LeftStickY) > 0.5);

    const isDucking = keyboard.isHeld(Keys.ArrowDown) || isDuckingPad;

    const wasOnGround = this.isOnGround;

    if (!this.isOnGround) {
      this.vel.y += isDucking ? 60 : 25;
    }

    if (this.pos.y >= 443) {
      this.pos.y = 443;
      this.vel.y = 0;
      this.isOnGround = true;
      if (!wasOnGround) this.landSquashTimer = 10;
    }

    if (isJumping && this.isOnGround) {
      this.vel.y = -360;
      this.isOnGround = false;
      this.landSquashTimer = 0;
    }

    this.handleVisuals(isDucking);
  }

  private handleGhostCollision(ghost: Ghost) {
    ghost.kill();
    if (ghost.isBlue) {
      Resources.ghostSound.play();
      state.setScore(state.score + 200);
    } else {
      this.gameScene.loseLife();
    }
  }

  private handleItemCollision(item: CollectibleItem, engine: Engine) {
    item.kill();
    if (item.itemType === "dot") {
      state.setScore(state.score + 10);
      if (!Resources.eatingSound.isPlaying()) Resources.eatingSound.play();
    } else if (item.itemType === "power_pill") {
      state.setScore(state.score + 50);
      Resources.powerSound.play();
      this.gameScene.activatePowerMode();
      this.gameScene.gainLife(engine);
    } else {
      state.setScore(state.score + 100);
      Resources.fruitSound.play();
    }
  }

  private handleVisuals(isDucking: boolean) {
    this.rotation = 0;

    if (isDucking) {
      this.scale.setTo(2, 1);
    } else if (!this.isOnGround) {
      const stretch = Math.abs(this.vel.y) * 0.0005;
      this.scale.setTo(2 - stretch * 0.5, 2 + stretch);
      this.rotation = Math.min(
        0.4,
        Math.max(-0.4, this.vel.y * (this.vel.y < 0 ? 0.0008 : 0.0004)),
      );
    } else if (this.landSquashTimer > 0) {
      const squash = (this.landSquashTimer-- / 10) * 0.4;
      this.scale.setTo(2 + squash * 0.5, 2 - squash);
    } else {
      this.scale.setTo(2, 2);
    }
  }
}
