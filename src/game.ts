import { Engine, DisplayMode } from "excalibur";
import { ResourceLoader } from "./resources";
import { GameplayScene } from "./scenes/GameplayScene";
import "./game-over-overlay";

class Game extends Engine {
  constructor() {
    super({
      width: 1440,
      height: 800,
      displayMode: DisplayMode.FitScreen,
      fixedUpdateFps: 60,
    });
  }

  onInitialize() {
    // Gameplay scene registreren en laden
    const gameplayScene = new GameplayScene();
    this.add("gameplay", gameplayScene);
    this.goToScene("gameplay");
  }
}

const game = new Game();
(window as any).game = game;
game.start(ResourceLoader);
