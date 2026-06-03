import { Resources } from "../resources";

export class AudioManager {
  private static instance: AudioManager;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public playIntro(): void {
    Resources.introSound.play();
  }

  public playSireneEasy(): void {
    Resources.sireneEasy.loop = true;
    Resources.sireneEasy.play();
  }

  public stopSireneEasy(): void {
    Resources.sireneEasy.stop();
  }

  public playSireneHard(): void {
    Resources.sireneHard.loop = true;
    Resources.sireneHard.play();
  }

  public stopSireneHard(): void {
    Resources.sireneHard.stop();
  }

  public playEating(): void {
    if (!Resources.eatingSound.isPlaying()) {
      Resources.eatingSound.play();
    }
  }

  public playPower(): void {
    Resources.powerSound.play();
  }

  public playFruit(): void {
    Resources.fruitSound.play();
  }

  public playHighscore(): void {
    Resources.highscoreSound.play();
  }

  public playLoseLife(): void {
    Resources.loseLifeSound.play();
  }

  public playGameOver(): void {
    Resources.gameOverSound.play();
  }

  public playGhost(): void {
    Resources.ghostSound.play();
  }

  public stopAllMusic(): void {
    Resources.sireneEasy.stop();
    Resources.sireneHard.stop();
  }
}

export const audioManager = AudioManager.getInstance();
