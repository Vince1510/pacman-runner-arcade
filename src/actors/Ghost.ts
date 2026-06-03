import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";
import { gameStateManager } from "../managers/GameStateManager";

// 4 verschillende spookjes
export type GhostVariant = "blinky" | "pinky" | "inky" | "clyde";

export class Ghost extends Actor {
  private ghostType: "ground" | "air";
  private ghostVariant: GhostVariant;
  public isBlue: boolean = false;

  constructor(type: "ground" | "air", variant: GhostVariant) {
    super({
      pos: new Vector(1500, type === "ground" ? 694 : 670),
      width: 30,
      height: 30,
      // COLLISION TYPE: Passive zodat Excalibur botsingen met de speler registreert
      collisionType: CollisionType.Passive,
    });
    this.ghostType = type;
    this.ghostVariant = variant;
  }

  onInitialize(engine: Engine) {
    // VARIANT: Als power mode actief is, verander dan direct als een blauw spookje!
    if (gameStateManager.isPowerModeActive) {
      this.isBlue = true;
      const blueSprite = Resources.blueGhost.toSprite();
      blueSprite.width = 30;
      blueSprite.height = 30;
      this.graphics.use(blueSprite);
    } else {
      //anders verander weer in random spookje
      const ghostSprite = Resources[this.ghostVariant].toSprite();
      ghostSprite.width = 30;
      ghostSprite.height = 30;
      this.graphics.use(ghostSprite);
    }

    this.vel.x = gameStateManager.speed ? -gameStateManager.speed : -300;
  }

  public makeBlue() {
    this.isBlue = true;
    const blueSprite = Resources.blueGhost.toSprite();
    blueSprite.width = 30;
    blueSprite.height = 30;
    this.graphics.use(blueSprite);
  }

  public makeNormal() {
    this.isBlue = false;
    const normalSprite = Resources[this.ghostVariant].toSprite();
    normalSprite.width = 30;
    normalSprite.height = 30;
    this.graphics.use(normalSprite);
  }

  update(engine: Engine, _delta: number) {
    super.update(engine, _delta);

    // Snelheid dynamisch aanpassen op basis van de gamesnelheid
    if (gameStateManager.speed) {
      this.vel.x = -gameStateManager.speed;
    }

    if (this.pos.x < -50) {
      this.kill();
      console.log("Ghost verwijderd omdat hij uit beeld is!");
    }
  }
}
