import { Actor, Engine, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";
import { speed, lives } from "../gameState";

export type ItemType = "dot" | "power_pill" | "apple" | "strawberry";

export class CollectibleItem extends Actor {
  public itemType: ItemType;

  constructor(type: ItemType, yPos: number) {
    let size = 20;
    let adjustedY = yPos;

    if (type === "dot") {
      size = 20;
      adjustedY = 690;
    } else if (type === "power_pill") {
      size = 80;
      adjustedY = 677;
    } else {
      size = 40;
      adjustedY = 689;
    }

    super({
      pos: new Vector(1500, adjustedY),
      width: size,
      height: size,
      collisionType: CollisionType.Passive,
    });
    this.itemType = type;
  }

  onInitialize(_engine: Engine) {
    let sprite;
    if (this.itemType === "dot") {
      sprite = Resources.dot.toSprite();
      sprite.width = 20;
      sprite.height = 20;
    } else if (this.itemType === "power_pill") {
      sprite = Resources.dot.toSprite();
      sprite.width = 80;
      sprite.height = 80;
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

    this.vel.x = speed ? -speed : -300;
  }

  update(engine: Engine) {
    super.update(engine, 1000 / 60);

    if (speed) {
      this.vel.x = -speed;
    }

    if (this.pos.x < -50) {
      this.kill();
    }
  }
}
