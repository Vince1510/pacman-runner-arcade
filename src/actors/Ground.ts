import {
  Actor,
  Vector,
  Engine,
  ImageSource,
  ImageWrapping,
  Sprite,
} from "excalibur";
import { gameStateManager } from "../managers/GameStateManager";

export class Ground extends Actor {
  private sprite?: Sprite;

  constructor() {
    super({
      pos: new Vector(0, 800), // Bodem van het scherm
      width: 1440,
      height: 91,
      anchor: new Vector(0, 1), // Linksonder verankeren
    });
  }

  async onInitialize(engine: Engine) {
    // Teken het neongradiënt op een tijdelijk canvas
    const canvas = document.createElement("canvas");
    canvas.width = 801;
    canvas.height = 91;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 801, 0);

      gradient.addColorStop(0, "rgba(255, 0, 127, 0)");
      gradient.addColorStop(0.1, "rgba(255, 0, 127, 1)");
      gradient.addColorStop(0.5, "rgba(127, 0, 255, 1)");
      gradient.addColorStop(0.9, "rgba(0, 245, 255, 1)");
      gradient.addColorStop(1, "rgba(0, 245, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 801, 91);
    }
    const dataUrl = canvas.toDataURL();

    // Maak een herhalende ImageSource met de Data URL
    const imageSource = new ImageSource(dataUrl, {
      wrapping: ImageWrapping.Repeat,
    });

    await imageSource.load();

    this.sprite = imageSource.toSprite();
    // Breedte instellen op de volledige breedte (1440) om horizontaal te herhalen
    this.sprite.sourceView.width = 1440;
    this.sprite.sourceView.height = 91;
    this.sprite.destSize.width = 1440;
    this.sprite.destSize.height = 91;

    this.graphics.use(this.sprite);
  }

  update(engine: Engine) {
    super.update(engine, 1000 / 60);

    if (
      gameStateManager.speed &&
      !gameStateManager.isIntroPlaying &&
      this.sprite
    ) {
      const scrollSpeed = gameStateManager.speed / 60;
      this.sprite.sourceView.x += scrollSpeed;
    }
  }
}
