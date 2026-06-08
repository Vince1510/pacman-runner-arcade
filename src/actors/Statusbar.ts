import { Actor, Vector, Label, Font, Color, Engine } from "excalibur";
import { Heart } from "./Heart";
import { Resources } from "../resources";

export class Statusbar extends Actor {
  private scoreLabel!: Label;
  private highscoreLabel!: Label;
  public difficultyLabel!: Label;
  private speedLabel!: Label;
  public hearts: Heart[] = [];

  constructor() {
    super({
      pos: new Vector(0, 0),
      anchor: new Vector(0, 0),
    });
    this.z = 100;
  }

  onInitialize(engine: Engine) {
    // --- GAME BAR BACKGROUND ---
    const uiBar = new Actor({
      pos: new Vector(720, 25),
      width: 1440,
      height: 50,
      color: Color.fromHex("#1a1a24"),
    });
    uiBar.z = 100;
    engine.add(uiBar);

    // Voeg 3 hartjes toe voor de levens linksboven
    for (let i = 0; i < 3; i++) {
      const heart = new Heart(35 + i * 35, 25);
      heart.z = 101;
      this.hearts.push(heart);
      engine.add(heart);
    }

    // Score label (x = 200)
    this.scoreLabel = new Label({
      text: "SCORE: 0000",
      pos: new Vector(200, 16),
      font: new Font({
        family: "monospace",
        size: 18,
        color: Color.White,
      }),
    });
    this.scoreLabel.z = 101;
    engine.add(this.scoreLabel);

    // Highscore label (x = 360)
    this.highscoreLabel = new Label({
      text: "HI: 0000",
      pos: new Vector(360, 16),
      font: new Font({
        family: "monospace",
        size: 18,
        color: Color.Yellow,
      }),
    });
    this.highscoreLabel.z = 101;
    engine.add(this.highscoreLabel);

    // Difficulty label (x = 510)
    this.difficultyLabel = new Label({
      text: "EASY",
      pos: new Vector(510, 16),
      font: new Font({
        family: "monospace",
        size: 18,
        color: Color.Green,
      }),
    });
    this.difficultyLabel.z = 101;
    engine.add(this.difficultyLabel);

    // Speed label (x = 640)
    this.speedLabel = new Label({
      text: "SPEED: 300",
      pos: new Vector(640, 16),
      font: new Font({
        family: "monospace",
        size: 18,
        color: Color.Cyan,
      }),
    });
    this.speedLabel.z = 101;
    engine.add(this.speedLabel);
  }

  /** Roep dit elke frame aan vanuit game.ts om de HUD te updaten */
  updateHud(score: number, highscore: number, speed: number) {
    this.scoreLabel.text = `SCORE: ${Math.floor(score).toString().padStart(4, "0")}`;
    this.highscoreLabel.text = `HI: ${highscore.toString().padStart(4, "0")}`;
    this.speedLabel.text = `SPEED: ${Math.round(speed)}`;
  }

  setDifficulty(state: "EASY" | "HARD" | "POWER") {
    if (state === "EASY") {
      this.difficultyLabel.text = "EASY";
      this.difficultyLabel.font.color = Color.Green;
    } else if (state === "HARD") {
      this.difficultyLabel.text = "HARD";
      this.difficultyLabel.font.color = Color.Red;
    } else {
      this.difficultyLabel.text = "POWER";
      this.difficultyLabel.font.color = Color.Blue;
    }
  }

  removeHeart() {
    const heart = this.hearts.pop();
    if (heart) {
      heart.kill();
    }
    return this.hearts.length;
  }

  addHeart(engine: Engine) {
    const nextIndex = this.hearts.length;
    const heart = new Heart(35 + nextIndex * 35, 25);
    heart.z = 101;
    this.hearts.push(heart);
    engine.add(heart);
    return this.hearts.length;
  }
}
