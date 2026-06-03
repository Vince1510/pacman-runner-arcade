import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";

export type ItemType = "dot" | "power_pill" | "apple" | "strawberry";

export class CollectibleItem extends Actor {
  public itemType: ItemType;

  constructor(type: ItemType, yPos: number) {
    let size = 20;
    let adjustedY = yPos;

    if (type === "dot") {
      size = 10;
      adjustedY = 290;
    } else if (type === "power_pill") {
      size = 64; // Nog groter! (was 48)
      adjustedY = 290; // Ligt netjes op de grond (top van grond is 309, 277 + 32 = 309)
    } else {
      size = 40; // Fruit 2x groter
      adjustedY = 290; // Ligt netjes op de grond
    }

    super({
      pos: new Vector(900, adjustedY),
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

    const game = engine as any;
    if (game.speed) {
      this.vel.x = -game.speed;
    } else {
      this.vel.x = -300;
    }
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    const game = engine as any;
    if (game.speed) {
      this.vel.x = -game.speed;
    }

    if (this.pos.x < -50) {
      this.kill();
    }
  }
}
