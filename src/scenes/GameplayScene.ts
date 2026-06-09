import { Scene, Engine, Timer, Vector } from "excalibur";
import { Player } from "../actors/Player";
import { Ghost, GhostVariant } from "../actors/Ghost";
import { CollectibleItem, ItemType } from "../actors/Item";
import { Background } from "../actors/Background";
import { Statusbar } from "../actors/Statusbar";
import { Resources } from "../resources";
import * as state from "../gameState";

const POWER_MODE_FRAMES = 240;

export class GameplayScene extends Scene {
  private statusbar!: Statusbar;
  private ghostSpawner!: Timer;
  private dotSpawner!: Timer;
  private introTimer!: Timer;
  private powerModeFramesRemaining = 0;

  public onInitialize(engine: Engine) {
    this.add(new Background());
    this.add(new Player(this));
    this.add((this.statusbar = new Statusbar()));

    this.resetState();
    Resources.introSound.play();

    this.introTimer = new Timer({
      interval: 4200,
      action: () => {
        state.setIsIntroPlaying(false);
        state.setSpeed(300);
        this.playMusic(Resources.sireneEasy);
        this.ghostSpawner.start();
        this.dotSpawner.start();
      },
    });

    this.ghostSpawner = new Timer({
      action: () => this.spawnRandomObject(),
      interval: 1500,
      repeats: true,
    });

    this.dotSpawner = new Timer({
      action: () => this.spawnConstantDot(),
      interval: 2000,
      repeats: true,
    });

    this.add(this.introTimer);
    this.add(this.ghostSpawner);
    this.add(this.dotSpawner);
    this.introTimer.start();
  }

  public onPreUpdate() {
    if (state.isGameOver || state.isIntroPlaying) return;

    const dt = 1 / 60;

    state.setScore(state.score + dt * 10);

    if (!state.isPowerModeActive) {
      const growthFactor = 1 + state.score * 0.0001;
      state.setSpeed(state.speed + dt * 15 * growthFactor);
    }

    if (
      state.highscore > 0 &&
      Math.floor(state.score) > state.highscore &&
      !state.hasPlayedHighscoreSound
    ) {
      state.setHasPlayedHighscoreSound(true);
      Resources.highscoreSound.play();
    }

    if (state.isPowerModeActive && --this.powerModeFramesRemaining <= 0) {
      this.togglePowerMode(false);
    }

    this.statusbar.updateHud(state.score, state.highscore, state.speed);

    if (!state.isPowerModeActive) {
      const targetDiff = state.speed >= 600 ? "HARD" : "EASY";

      if (state.currentDifficulty !== targetDiff) {
        state.setCurrentDifficulty(targetDiff);
        this.statusbar.setDifficulty(targetDiff);
        this.playMusic(
          targetDiff === "HARD" ? Resources.sireneHard : Resources.sireneEasy,
        );
      }
    }

    this.ghostSpawner.interval = Math.max(
      450,
      1500 - (state.speed - 300) * 1.4,
    );
    this.dotSpawner.interval = (100 / state.speed) * 1000;
  }

  public loseLife() {
    if (state.isGameOver) return;

    const livesLeft = this.statusbar.removeHeart();
    state.setLives(livesLeft);
    livesLeft === 0 ? this.triggerGameOver() : Resources.loseLifeSound.play();
  }

  public gainLife(engine: Engine) {
    if (state.isGameOver || state.lives >= 5) return;
    state.setLives(this.statusbar.addHeart(engine));
  }

  public activatePowerMode() {
    this.togglePowerMode(true);
  }

  private togglePowerMode(active: boolean) {
    state.setIsPowerModeActive(active);
    this.powerModeFramesRemaining = active ? POWER_MODE_FRAMES : 0;
    this.statusbar.setDifficulty(active ? "POWER" : state.currentDifficulty);

    (this.actors.filter((a) => a instanceof Ghost) as Ghost[]).forEach(
      (ghost) => {
        active ? ghost.makeBlue() : ghost.makeNormal();
      },
    );
  }

  private triggerGameOver() {
    state.setIsGameOver(true);
    Resources.sireneEasy.stop();
    Resources.sireneHard.stop();
    Resources.gameOverSound.play();
    state.setSpeed(0);
    this.stopSpawners();

    if (Player.instance) {
      Player.instance.vel = new Vector(0, 0);
      Player.instance.graphics.use(Resources.pacmanClosed.toSprite());
    }

    const finalScore = Math.floor(state.score);
    const isNewHi = finalScore > state.highscore;

    if (isNewHi) {
      state.setHighscore(finalScore);
      localStorage.setItem("pacman_runner_highscore", finalScore.toString());
    }

    if (typeof (window as any).showGameOverOverlay === "function") {
      (window as any).showGameOverOverlay(finalScore, isNewHi);
    }
  }

  public stopSpawners() {
    this.ghostSpawner?.stop();
    this.dotSpawner?.stop();
  }

  private resetState() {
    state.setScore(0);
    state.setSpeed(0);
    state.setLives(3);
    state.setIsIntroPlaying(true);
    state.setIsGameOver(false);
    state.setIsPowerModeActive(false);
    state.setCurrentDifficulty("EASY");
    state.setHasPlayedHighscoreSound(false);
    this.powerModeFramesRemaining = 0;

    const saved = localStorage.getItem("pacman_runner_highscore");
    state.setHighscore(saved ? parseInt(saved, 10) : 0);
  }

  private spawnConstantDot() {
    if (state.lives > 0) this.add(new CollectibleItem("dot", 300));
  }

  private spawnRandomObject() {
    const rand = Math.random();

    if (rand < 0.7) {
      this.spawnRandomGhost();
    } else if (rand < 0.95 || state.isPowerModeActive) {
      const fruitType: ItemType = Math.random() > 0.5 ? "apple" : "strawberry";
      this.add(new CollectibleItem(fruitType, 300));
    } else {
      this.add(new CollectibleItem("power_pill", 500));
    }
  }

  private spawnRandomGhost() {
    const ghostType = Math.random() > 0.5 ? "ground" : "air";
    const variants: GhostVariant[] = ["blinky", "pinky", "inky", "clyde"];
    this.add(
      new Ghost(
        ghostType,
        variants[Math.floor(Math.random() * variants.length)],
      ),
    );
  }

  private playMusic(sound: any) {
    Resources.sireneEasy.stop();
    Resources.sireneHard.stop();
    sound.loop = true;
    sound.play();
  }
}
