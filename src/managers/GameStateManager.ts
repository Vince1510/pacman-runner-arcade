import { Vector, Actor } from "excalibur";
import { audioManager } from "./AudioManager";
import { uiManager } from "./UIManager";
import { Statusbar } from "../actors/Statusbar";
import { Player } from "../actors/Player";
import { Ghost } from "../actors/Ghost";
import { Resources } from "../resources";

export interface IGameplayScene {
  stopSpawners(): void;
  actors: readonly Actor[];
}

export class GameStateManager {
  private static instance: GameStateManager;

  public score: number = 0;
  public speed: number = 0;
  public highscore: number = 0;
  public lives: number = 3;
  public hasPlayedHighscoreSound: boolean = false;
  public isIntroPlaying: boolean = true;
  public isGameOver: boolean = false;

  public currentDifficultyState: "EASY" | "HARD" = "EASY";

  public isPowerModeActive: boolean = false;
  private powerModeFramesRemaining: number = 0;
  private static readonly POWER_MODE_FRAMES = 240; // 4 seconds @ 60fps

  private statusbar: Statusbar | null = null;
  private activeScene: IGameplayScene | null = null;

  private constructor() {}

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public initialize(statusbar: Statusbar, scene: IGameplayScene) {
    this.statusbar = statusbar;
    this.activeScene = scene;
    this.score = 0;
    this.speed = 0;
    this.lives = 3;
    this.isIntroPlaying = true;
    this.isGameOver = false;
    this.isPowerModeActive = false;
    this.powerModeFramesRemaining = 0;
    this.currentDifficultyState = "EASY";
    this.hasPlayedHighscoreSound = false;

    // highscore van localStorage
    const savedHighScore = localStorage.getItem("dino_highscore");
    if (savedHighScore) {
      this.highscore = parseInt(savedHighScore, 10);
    } else {
      this.highscore = 0;
    }
  }

  public startGameplay() {
    this.isIntroPlaying = false;
    this.speed = 300;

    this.currentDifficultyState = "EASY";
    audioManager.playSireneEasy();
  }

  public update() {
    if (this.isGameOver || this.isIntroPlaying || !this.statusbar) return;

    // Geen delta — fixedUpdateFps = 60, elke frame = 1/60s
    const frameTimeSec = 1 / 60;

    // Score stijgt geleidelijk met de tijd
    this.score += frameTimeSec * 10;

    // Snelheid neemt geleidelijk toe (maximaal 900)
    if (this.speed < 900) {
      this.speed += frameTimeSec * 15;
    }

    // Controleer of de highscore live is gebroken tijdens het spelen
    if (
      this.highscore > 0 &&
      Math.floor(this.score) > this.highscore &&
      !this.hasPlayedHighscoreSound
    ) {
      this.hasPlayedHighscoreSound = true;
      audioManager.playHighscore();
      console.log("🏆 NIEUWE HIGHSCORE GEBROKEN!");
    }

    // Power mode timer aftellen (in frames, geen ms)
    if (this.isPowerModeActive) {
      this.powerModeFramesRemaining--;
      if (this.powerModeFramesRemaining <= 0) {
        this.deactivatePowerMode();
      }
    }

    // Update HUD
    this.statusbar.updateHud(this.score, this.highscore, this.speed);

    // Moeilijkheidsgraad updaten (alleen als power modus niet actief is!)
    if (!this.isPowerModeActive) {
      if (this.speed >= 600) {
        if (this.currentDifficultyState === "EASY") {
          this.currentDifficultyState = "HARD";
          this.statusbar.setDifficulty("HARD");
          audioManager.stopSireneEasy();
          audioManager.playSireneHard();
        }
      } else {
        if (this.currentDifficultyState === "HARD") {
          this.currentDifficultyState = "EASY";
          this.statusbar.setDifficulty("EASY");
          audioManager.stopSireneHard();
          audioManager.playSireneEasy();
        }
      }
    }
  }

  public activatePowerMode() {
    this.isPowerModeActive = true;
    this.powerModeFramesRemaining = GameStateManager.POWER_MODE_FRAMES;

    // HUD aanpassen
    if (this.statusbar) {
      this.statusbar.setDifficulty("POWER");
    }

    // Maak alle actieve spookjes blauw
    if (this.activeScene) {
      const activeGhosts = this.activeScene.actors.filter(
        (actor) => actor instanceof Ghost,
      ) as Ghost[];
      for (const ghost of activeGhosts) {
        ghost.makeBlue();
      }
    }
  }

  public deactivatePowerMode() {
    this.isPowerModeActive = false;
    this.powerModeFramesRemaining = 0;

    // Herstel HUD moeilijkheidsgraad
    if (this.statusbar) {
      this.statusbar.setDifficulty(this.currentDifficultyState);
    }

    // Herstel alle actieve spookjes naar normaal
    if (this.activeScene) {
      const activeGhosts = this.activeScene.actors.filter(
        (actor) => actor instanceof Ghost,
      ) as Ghost[];
      for (const ghost of activeGhosts) {
        ghost.makeNormal();
      }
    }
  }

  public loseLife() {
    if (this.isGameOver || !this.statusbar) return;

    const livesLeft = this.statusbar.removeHeart();
    this.lives = livesLeft;

    console.log(`💥 Spookje geraakt! Levens over: ${livesLeft}`);

    if (livesLeft === 0) {
      this.isGameOver = true;
      console.log("💀 GAME OVER! Alle levens zijn op.");

      // Stop alle lopende sirenes bij game over
      audioManager.stopAllMusic();
      audioManager.playGameOver();

      // Zet game snelheid op 0 en stop alle spawners
      this.speed = 0;
      if (this.activeScene) {
        this.activeScene.stopSpawners();
      }

      // Bevries de player in stilstaande positie
      if (Player.instance) {
        Player.instance.vel = new Vector(0, 0);
        Player.instance.graphics.use(Resources.pacmanClosed.toSprite());
      }

      // Keur de nieuwe highscore goed en sla op bij game over
      const finalScore = Math.floor(this.score);
      const isNewHighscore = finalScore > this.highscore;

      if (isNewHighscore) {
        if (!this.hasPlayedHighscoreSound) {
          audioManager.playHighscore();
        }
        this.highscore = finalScore;
        localStorage.setItem("dino_highscore", this.highscore.toString());
      }

      // Toon de HTML game over overlay
      uiManager.showGameOverOverlay(finalScore, isNewHighscore);
    } else {
      audioManager.playLoseLife();
    }
  }
}

export const gameStateManager = GameStateManager.getInstance();
