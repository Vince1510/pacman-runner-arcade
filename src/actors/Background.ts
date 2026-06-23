import { Actor, Engine, Vector, Sprite } from "excalibur";
import { Resources } from "../resources";
import * as state from "../gameState";

export class Background extends Actor {
  private sprite!: Sprite;

  constructor() {
    super({
      pos: Vector.Zero,
      width: 800,
      height: 500,
      anchor: Vector.Zero,
      z: -1,
    });
  }

  onInitialize(_engine: Engine) {
    this.sprite = Resources.background.toSprite({
      sourceView: { x: 0, y: 0, width: 1440, height: 559 },
      destSize: { width: 800, height: 500 },
    });

    this.graphics.use(this.sprite);
  }

  update(engine: Engine) {
    if (state.speed && !state.isIntroPlaying) {
      const scrollSpeed = (state.speed * 0.3) / 60;
      this.sprite.sourceView.x += scrollSpeed;
    }
  }
}
