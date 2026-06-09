import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";
import * as state from "../gameState";

export type GhostVariant = "blinky" | "pinky" | "inky" | "clyde";

export class Ghost extends Actor {
  private ghostType: "ground" | "air";
  private ghostVariant: GhostVariant;
  public isBlue = false;

  constructor(type: "ground" | "air", variant: GhostVariant) {
    super({
      pos: new Vector(1500, type === "ground" ? 694 : 670),
      width: 30,
      height: 30,
      collisionType: CollisionType.Passive,
    });
    this.ghostType = type;
    this.ghostVariant = variant;
  }

  onInitialize(_engine: Engine) {
    this.isBlue = state.isPowerModeActive;
    this.setGhostSprite();

    this.vel.x = state.speed ? -state.speed : -300;
  }

  public makeBlue() {
    this.isBlue = true;
    this.setGhostSprite();
  }

  public makeNormal() {
    this.isBlue = false;
    this.setGhostSprite();
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    if (state.speed) this.vel.x = -state.speed;
    if (this.pos.x < -50) this.kill();
  }

  private setGhostSprite() {
    const resourceName = this.isBlue ? "blueGhost" : this.ghostVariant;
    const ghostSprite = Resources[resourceName].toSprite();
    ghostSprite.width = 30;
    ghostSprite.height = 30;
    this.graphics.use(ghostSprite);
  }
}
