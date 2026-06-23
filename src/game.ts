import { Engine, DisplayMode } from "excalibur";
import { ResourceLoader } from "./resources";
import { GameplayScene } from "./scenes/GameplayScene";
import "./game-over-overlay";

class Game extends Engine {
  public mygamepad: any = null;

  constructor() {
    super({
      width: 800,
      height: 500,
      displayMode: DisplayMode.FitScreen,
      fixedUpdateFps: 60,
      suppressPlayButton: true,
    });
  }

  onInitialize() {
    const gameplayScene = new GameplayScene();
    this.add("gameplay", gameplayScene);
    this.goToScene("gameplay");

    this.input.gamepads.enabled = true;
    this.input.gamepads.on("connect", (connectevent: any) => {
      console.log("gamepad detected");
      this.mygamepad = connectevent.gamepad;
    });
  }
}

const game = new Game();
(window as any).game = game;
game.start(ResourceLoader);
