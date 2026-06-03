import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";

// 4 verschillende spookjes
export type GhostVariant = "blinky" | "pinky" | "inky" | "clyde";

export class Ghost extends Actor {
  private ghostType: "ground" | "air";
  private ghostVariant: GhostVariant;
  constructor(type: "ground" | "air", variant: GhostVariant) {
    super({
      pos: new Vector(900, type === "ground" ? 300 : 292),
      width: 15,
      height: 15,
      // COLLISION TYPE: Passive zodat Excalibur botsingen met de speler registreert
      collisionType: CollisionType.Passive,
    });
    this.ghostType = type;
    this.ghostVariant = variant;
  }

  onInitialize(engine: Engine) {
    // VARIANT: Kies de juiste sprite op basis van de ghost-variant
    const ghostSprite = Resources[this.ghostVariant].toSprite();
    this.graphics.use(ghostSprite);
    this.vel.x = -300;
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    if (this.pos.x < -50) {
      this.kill();
      console.log("Ghost verwijderd omdat hij uit beeld is!");
    }
  }
}
