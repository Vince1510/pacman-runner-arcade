import {
  Actor,
  Color,
  Engine,
  Vector,
  Keys,
  Animation,
  CollisionType,
  CollisionStartEvent,
} from "excalibur";
import { Resources } from "../resources";
import { Ghost } from "./Ghost";
import { CollectibleItem } from "./Item";
import { gameStateManager } from "../managers/GameStateManager";
import { audioManager } from "../managers/AudioManager";

export class Player extends Actor {
  public static instance: Player | null = null;
  public isOnGround: boolean = true;
  private landSquashTimer = 0;

  constructor() {
    super({
      pos: new Vector(100, 709),
      width: 15,
      height: 15,
      color: Color.Blue,
      anchor: new Vector(0.5, 1),
      scale: new Vector(2, 2),
      // COLLISION TYPE: Active zorgt dat Excalibur botsingen detecteert voor dit object
      collisionType: CollisionType.Active,
    });
    Player.instance = this;
    (window as any).player = this;
  }

  onInitialize(engine: Engine): void {
    //pacman eet animatie
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
      // GHOST COLLISION
      if (event.other.owner instanceof Ghost) {
        const ghost = event.other.owner;

        if (ghost.isBlue) {
          //spookje opgegeten tijdens power mode
          audioManager.playGhost();
          ghost.kill();
          gameStateManager.score += 200;
        } else {
          //spookje geraakt zonder power mode
          ghost.kill();
          gameStateManager.loseLife();
        }
      }

      // COLLECTIBLE ITEM COLLISION
      if (event.other.owner instanceof CollectibleItem) {
        const item = event.other.owner;
        console.log(`🍎 Item opgepakt: ${item.itemType}`);

        if (item.itemType === "dot") {
          gameStateManager.score += 10;
          audioManager.playEating();
        } else if (item.itemType === "power_pill") {
          //score+50
          gameStateManager.score += 50;
          audioManager.playPower();
          //activeer power mode
          gameStateManager.activatePowerMode();
          // Voeg een extra hartje toe
          gameStateManager.gainLife(engine);
        } else if (item.itemType === "apple") {
          //score+100
          gameStateManager.score += 100;
          audioManager.playFruit();
        } else if (item.itemType === "strawberry") {
          //score+100
          gameStateManager.score += 100;
          audioManager.playFruit();
        }

        item.kill(); // Verwijder het item van het scherm
      }
    });
  }

  update(engine: Engine) {
    const wasOnGround = this.isOnGround;

    super.update(engine, 1000 / 60);

    if (!this.isOnGround) {
      // Trek de speler elke frame een stukje harder naar beneden
      // Aangezien we van 120 FPS naar 60 FPS gaan, verhogen we de zwaartekracht per frame naar 40
      this.vel.y += 40;
    }

    if (this.pos.y >= 709 && !this.isOnGround) {
      this.pos.y = 709;
      this.vel.y = 0;
      this.isOnGround = true;
    }

    // Detect landing
    if (this.isOnGround && !wasOnGround) {
      this.landSquashTimer = 10;
    }

    const keyboard = engine.input.keyboard;

    // JUMP: Spring met Pijl Omhoog
    if (keyboard.isHeld(Keys.ArrowUp) && this.isOnGround) {
      this.vel.y = -500;
      this.isOnGround = false;
      this.landSquashTimer = 0; // reset squash effect on jump
    }

    // Apply scale & rotation based on state
    if (keyboard.isHeld(Keys.ArrowDown)) {
      // Ducking overrides other states
      this.scale = new Vector(2, 1);
      this.rotation = 0;
      this.landSquashTimer = 0;
    } else if (!this.isOnGround) {
      // Air physics: squash/stretch and rotation tilt based on vertical velocity
      const stretchAmount = Math.abs(this.vel.y) * 0.0005;
      this.scale = new Vector(2 - stretchAmount * 0.5, 2 + stretchAmount);

      if (this.vel.y < 0) {
        // Jumping up: tilt up
        this.rotation = Math.max(-0.4, this.vel.y * 0.0008);
      } else {
        // Falling down: tilt down
        this.rotation = Math.min(0.4, this.vel.y * 0.0004);
      }
    } else if (this.landSquashTimer > 0) {
      // Land squash decay
      const squashAmount = (this.landSquashTimer / 10) * 0.4;
      this.scale = new Vector(2 + squashAmount * 0.5, 2 - squashAmount);
      this.rotation = 0;
      this.landSquashTimer--;
    } else {
      // Standard run state on ground
      this.scale = new Vector(2, 2);
      this.rotation = 0;
    }
  }
}
