import { Actor, Color, Vector, Engine, Canvas } from "excalibur";

export class Ground extends Actor {
  constructor(startX: number) {
    super({
      pos: new Vector(startX, 400), // Onderkant blijft op de bodem van het scherm (400)
      width: 801,
      height: 91,

      anchor: new Vector(0.5, 1),
    });
  }

  onInitialize() {
    this.vel.x = -300;

    const neonCanvas = new Canvas({
      width: 801,
      height: this.height,
      draw: (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 801, 0);

        gradient.addColorStop(0, "rgba(255, 0, 127, 0)");
        gradient.addColorStop(0.1, "rgba(255, 0, 127, 1)");
        gradient.addColorStop(0.5, "rgba(127, 0, 255, 1)");
        gradient.addColorStop(0.9, "rgba(0, 245, 255, 1)");
        gradient.addColorStop(1, "rgba(0, 245, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 801, this.height);
      },
    });

    this.graphics.use(neonCanvas);
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);

    if (this.pos.x <= -400) {
      this.pos.x = 1200;
    }
  }
}
