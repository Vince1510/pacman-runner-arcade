import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";
import { gameStateManager } from "../managers/GameStateManager";

export type ItemType = "dot" | "power_pill" | "apple" | "strawberry";

export class CollectibleItem extends Actor {
  public itemType: ItemType;

  constructor(type: ItemType, yPos: number) {
    let size = 20;
    let adjustedY = yPos;

    if (type === "dot") {
      size = 10;
      adjustedY = 690;
    } else if (type === "power_pill") {
      size = 64; // Nog groter! (was 48)
      adjustedY = 677; // Ligt netjes op de grond (top van grond is 709, 709 - 32 = 677)
    } else {
      size = 40; // Fruit 2x groter
      adjustedY = 689; // Ligt netjes op de grond (top van grond is 709, 709 - 20 = 689)
    }

    super({
      pos: new Vector(1500, adjustedY),
      width: size,
      height: size,
      collisionType: CollisionType.Passive,
    });
    this.itemType = type;
  }

  onInitialize(engine: Engine) {
    let sprite;
    if (this.itemType === "dot" || this.itemType === "power_pill") {
      sprite = Resources.dot.toSprite();
      if (this.itemType === "dot") {
        sprite.width = 10;
        sprite.height = 10;
      } else {
        sprite.width = 64;
        sprite.height = 64;
      }
    } else if (this.itemType === "apple") {
      sprite = Resources.apple.toSprite();
      sprite.width = 40;
      sprite.height = 40;
    } else {
      sprite = Resources.strawberry.toSprite();
      sprite.width = 40;
      sprite.height = 40;
    }

    this.graphics.use(sprite);

    if (gameStateManager.speed) {
      this.vel.x = -gameStateManager.speed;
    } else {
      this.vel.x = -300;
    }
  }

  update(engine: Engine) {
    super.update(engine, 1000 / 60);

    if (gameStateManager.speed) {
      this.vel.x = -gameStateManager.speed;
    }

    if (this.pos.x < -50) {
      this.kill();
    }
  }
}
