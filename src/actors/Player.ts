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

  update(engine: Engine, _delta: number) {
    super.update(engine, _delta);

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

    const keyboard = engine.input.keyboard;

    // JUMP: Spring met Pijl Omhoog
    if (keyboard.isHeld(Keys.ArrowUp) && this.isOnGround) {
      this.vel.y = -500;
      this.isOnGround = false;
    }

    // DUCK: Buk met Pijl Omlaag
    if (keyboard.isHeld(Keys.ArrowDown)) {
      // pacman wordt 0.5 keer zo klein in Y-as ten opzichte van de basisschaal 2
      this.scale = new Vector(2, 1);
    } else {
      // stop met bukken
      this.scale = new Vector(2, 2);
    }
  }
}
