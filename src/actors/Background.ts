import { Actor, Engine, Vector, Sprite } from "excalibur";
import { Resources } from "../resources";
import { gameStateManager } from "../managers/GameStateManager";

export class Background extends Actor {
  private sprite!: Sprite;

  constructor() {
    super({
      pos: new Vector(0, 0),
      width: 1440,
      height: 800,
      anchor: new Vector(0, 0),
    });
    this.z = -1;
  }

  onInitialize(engine: Engine) {
    this.sprite = Resources.background.toSprite();

    // Stel sourceView in op de breedte van het scherm zodat de textuur horizontaal herhaalt
    // De originele afbeelding is 1024x559px.
    this.sprite.sourceView.width = 1440;
    this.sprite.sourceView.height = 559;

    // Schaal de getekende grootte naar het volledige scherm
    this.sprite.destSize.width = 1440;
    this.sprite.destSize.height = 800;

    this.graphics.use(this.sprite);
  }

  update(engine: Engine) {
    super.update(engine, 1000 / 60);

    if (gameStateManager.speed && !gameStateManager.isIntroPlaying) {
      const scrollSpeed = (gameStateManager.speed * 0.3) / 60;
      this.sprite.sourceView.x += scrollSpeed;
    }
  }
}
