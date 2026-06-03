import { Actor, Vector } from "excalibur";
import { Resources } from "../resources";

export class Heart extends Actor {
  constructor(x: number, y: number) {
    super({
      pos: new Vector(x, y),
      width: 24,
      height: 24,
    });
  }

  onInitialize() {
    const sprite = Resources.heart.toSprite();
    sprite.width = 24;
    sprite.height = 24;
    this.graphics.use(sprite);
  }
}
