import { Engine, DisplayMode, Timer } from "excalibur";
import { Player } from "./actors/Player";
import { ResourceLoader } from "./resources";
import { Ghost, GhostVariant } from "./actors/Ghost";
import { Ground } from "./actors/Ground";

class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 400,
      displayMode: DisplayMode.FitScreen,
    });
  }

  onInitialize() {
    console.log("De game start nu!");

    const ground1 = new Ground(400);
    const ground2 = new Ground(1200);

    this.add(ground1);
    this.add(ground2);

    const player = new Player();
    this.add(player);

    const ghostSpawner = new Timer({
      action: () => this.spawnRandomGhost(),
      interval: 1500,
      repeats: true,
    });

    this.add(ghostSpawner);
    ghostSpawner.start();
  }

  private spawnRandomGhost() {
    // 50% kans ground of air ghost
    const chosenType = Math.random() > 0.5 ? "ground" : "air";

    // random welke kleur ghost
    const variants: GhostVariant[] = ["blinky", "pinky", "inky", "clyde"];
    const chosenVariant = variants[Math.floor(Math.random() * variants.length)];

    const newGhost = new Ghost(chosenType, chosenVariant);

    this.add(newGhost);

    console.log(
      `👻 Spookje gespawned: type=${chosenType}, variant=${chosenVariant}`,
    );
  }
}

const game = new Game();
game.start(ResourceLoader);
