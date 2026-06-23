import { Actor, Vector, Label, Font, Color, Engine } from "excalibur";
import { Heart } from "./Heart";

export class Statusbar extends Actor {
  private scoreLabel!: Label;
  private highscoreLabel!: Label;
  public difficultyLabel!: Label;
  private speedLabel!: Label;
  public hearts: Heart[] = [];

  constructor() {
    super({ pos: Vector.Zero, anchor: Vector.Zero, z: 100 });
  }

  onInitialize(engine: Engine) {
    engine.add(
      new Actor({
        pos: new Vector(720, 25),
        width: 1440,
        height: 50,
        color: Color.fromHex("#1a1a24"),
        z: 100,
      }),
    );

    for (let i = 0; i < 3; i++) this.addHeart(engine);

    engine.add(
      (this.scoreLabel = this.createLabel("SCORE: 0000", 200, Color.White)),
    );
    engine.add(
      (this.highscoreLabel = this.createLabel("HI: 0000", 360, Color.Yellow)),
    );
    engine.add(
      (this.difficultyLabel = this.createLabel("EASY", 510, Color.Green)),
    );
    engine.add(
      (this.speedLabel = this.createLabel("SPEED: 166", 640, Color.Cyan)),
    );
  }

  updateHud(score: number, highscore: number, speed: number) {
    this.scoreLabel.text = `SCORE: ${Math.floor(score).toString().padStart(4, "0")}`;
    this.highscoreLabel.text = `HI: ${highscore.toString().padStart(4, "0")}`;
    this.speedLabel.text = `SPEED: ${Math.round(speed)}`;
  }

  setDifficulty(state: "EASY" | "HARD" | "POWER") {
    const config = {
      EASY: { text: "EASY", color: Color.Green },
      HARD: { text: "HARD", color: Color.Red },
      POWER: { text: "POWER", color: Color.Blue },
    }[state];

    this.difficultyLabel.text = config.text;
    this.difficultyLabel.font.color = config.color;
  }

  removeHeart() {
    this.hearts.pop()?.kill();
    return this.hearts.length;
  }

  addHeart(engine: Engine) {
    const heart = new Heart(35 + this.hearts.length * 35, 25);
    heart.z = 101;
    this.hearts.push(heart);
    engine.add(heart);
    return this.hearts.length;
  }

  private createLabel(text: string, xPos: number, color: Color): Label {
    return new Label({
      text,
      pos: new Vector(xPos, 16),
      z: 101,
      font: new Font({ family: "monospace", size: 18, color }),
    });
  }
}
