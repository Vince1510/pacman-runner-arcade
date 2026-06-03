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

export class Player extends Actor {
  public lives: number = 3;
  public isOnGround: boolean = true;

  constructor() {
    super({
      pos: new Vector(100, 309),
      width: 15,
      height: 15,
      color: Color.Blue,
      anchor: new Vector(0.5, 1),
      // COLLISION TYPE: Active zorgt dat Excalibur botsingen detecteert voor dit object
      collisionType: CollisionType.Active,
    });
  }

  onInitialize(engine: Engine): void {
    console.log("pacman met animaties is klaar!");

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

    // EVENT: Luister naar het 'collisionstart' event (afgevuurd bij eerste contact)
    this.on("collisionstart", (event: CollisionStartEvent) => {
      //controleer of het object waartegen we botsen een Ghost is
      if (event.other.owner instanceof Ghost) {
        console.log("spookje geraakt");
        engine.stop();
      }
    });
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    if (!this.isOnGround) {
      // Trek de speler elke frame een stukje harder naar beneden
      this.vel.y += 20;
    }

    if (this.pos.y >= 309 && !this.isOnGround) {
      this.pos.y = 309;
      this.vel.y = 0;
      this.isOnGround = true;
    }

    const keyboard = engine.input.keyboard;

    if (keyboard.isHeld(Keys.ArrowUp) && this.isOnGround) {
      //jump
      this.vel.y = -500;
      this.isOnGround = false;
    }

    if (keyboard.isHeld(Keys.ArrowDown) && this.isOnGround) {
      // pacman wordt 0.5 keer zo klein
      this.scale = new Vector(1, 0.5);
    } else {
      //stop met bukken
      this.scale = new Vector(1, 1);
    }
  }
}
