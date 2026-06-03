import { Scene, Engine, Timer } from "excalibur";
import { Player } from "../actors/Player";
import { Ghost, GhostVariant } from "../actors/Ghost";
import { Ground } from "../actors/Ground";
import { CollectibleItem } from "../actors/Item";
import { Background } from "../actors/Background";
import { Statusbar } from "../actors/Statusbar";
import { gameStateManager, IGameplayScene } from "../managers/GameStateManager";
import { audioManager } from "../managers/AudioManager";

export class GameplayScene extends Scene implements IGameplayScene {
  private statusbar!: Statusbar;
  private ghostSpawner!: Timer;
  private dotSpawner!: Timer;
  private introTimer!: Timer;

  public onInitialize(engine: Engine) {
    // Background toevoegen
    const background = new Background();
    this.add(background);

    // Grond toevoegen
    const ground = new Ground();
    this.add(ground);

    // Player toevoegen
    const player = new Player();
    this.add(player);

    // Status bar toevoegen
    this.statusbar = new Statusbar();
    this.add(this.statusbar);

    // GameStateManager initialiseren
    gameStateManager.initialize(this.statusbar, this);

    // Intro sound starten
    audioManager.playIntro();

    this.introTimer = new Timer({
      interval: 4200,
      repeats: false,
      action: () => {
        gameStateManager.startGameplay();

        // Start de spawners
        this.ghostSpawner.start();
        this.dotSpawner.start();

        console.log("Intro afgelopen, start gameplay!");
      },
    });
    this.add(this.introTimer);
    this.introTimer.start();

    // Obstacle & premium items spawner (ghosts, fruits, power pills)
    this.ghostSpawner = new Timer({
      action: () => this.spawnRandomObject(),
      interval: 1500,
      repeats: true,
    });
    this.add(this.ghostSpawner);

    // Constant small dot spawner (spaced dynamically based on speed)
    this.dotSpawner = new Timer({
      action: () => this.spawnConstantDot(),
      interval: 2000,
      repeats: true,
    });
    this.add(this.dotSpawner);
  }

  public onPreUpdate(engine: Engine, _deltaMs: number) {
    // Update de state manager
    gameStateManager.update();

    if (gameStateManager.isGameOver || gameStateManager.isIntroPlaying) return;

    // Ghost spawntijd verkorten (interval krimpt naarmate de snelheid toeneemt tot minimaal 600ms)
    const newGhostInterval = Math.max(600, 1500 - (gameStateManager.speed - 300) * 1.5);
    this.ghostSpawner.interval = newGhostInterval;

    // Zorg ervoor dat de kleine pillen ALTIJD perfect op 100 pixels afstand van elkaar spawnen
    // Interval = Spacing / Snelheid * 1000
    const dotIntervalMs = (100 / gameStateManager.speed) * 1000;
    this.dotSpawner.interval = dotIntervalMs;
  }

  public stopSpawners() {
    if (this.ghostSpawner) this.ghostSpawner.stop();
    if (this.dotSpawner) this.dotSpawner.stop();
  }

  private spawnConstantDot() {
    if (gameStateManager.lives === 0) return;

    const dot = new CollectibleItem("dot", 300);
    this.add(dot);
  }

  private spawnRandomObject() {
    const r = Math.random();

    if (r < 0.7) {
      this.spawnRandomGhost();
    } else if (r < 0.95) {
      const fruitType = Math.random() > 0.5 ? "apple" : "strawberry";
      const fruit = new CollectibleItem(fruitType, 300);
      this.add(fruit);
      console.log(`🍎 Fruit gespawned: ${fruitType}`);
    } else {
      if (!gameStateManager.isPowerModeActive) {
        const powerPill = new CollectibleItem("power_pill", 500);
        this.add(powerPill);
        console.log(`⚡ Power Pill gespawned`);
      } else {
        if (Math.random() > 0.5) {
          this.spawnRandomGhost();
        } else {
          const fruitType = Math.random() > 0.5 ? "apple" : "strawberry";
          const fruit = new CollectibleItem(fruitType, 300);
          this.add(fruit);
        }
      }
    }
  }

  private spawnRandomGhost() {
    const chosenType = Math.random() > 0.5 ? "ground" : "air";

    const variants: GhostVariant[] = ["blinky", "pinky", "inky", "clyde"];
    const chosenVariant = variants[Math.floor(Math.random() * variants.length)];

    const newGhost = new Ghost(chosenType, chosenVariant);
    this.add(newGhost);

    console.log(`👻 Gespawned: type=${chosenType}, variant=${chosenVariant}`);
  }
}
