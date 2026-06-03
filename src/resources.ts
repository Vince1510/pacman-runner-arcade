import { ImageSource, ImageWrapping, Loader, Resource, Sound } from "excalibur";

const Resources = {
  background: new ImageSource("./images/background.png", {
    wrapping: ImageWrapping.Repeat,
  }),

  pacmanClosed: new ImageSource("./images/pacman/1.png"),
  pacmanHalf: new ImageSource("./images/pacman/2.png"),
  pacmanOpen: new ImageSource("./images/pacman/3.png"),

  blinky: new ImageSource("./images/ghosts/blinky.png"),
  pinky: new ImageSource("./images/ghosts/pinky.png"),
  inky: new ImageSource("./images/ghosts/inky.png"),
  clyde: new ImageSource("./images/ghosts/clyde.png"),
  blueGhost: new ImageSource("./images/ghosts/blue_ghost.png"),
  heart: new ImageSource("./images/other/heart.png"),
  dot: new ImageSource("./images/other/dot.png"),
  apple: new ImageSource("./images/other/apple.png"),
  strawberry: new ImageSource("./images/other/strawberry.png"),

  eatingSound: new Sound("./audio/pacman-eating.m4a"),
  fruitSound: new Sound("./audio/eating-fruit.m4a"),
  ghostSound: new Sound("./audio/eating-ghost.m4a"),
  powerSound: new Sound("./audio/power-pill.m4a"),
  sireneEasy: new Sound("./audio/ghost-sirene.m4a"),
  sireneHard: new Sound("./audio/ghost-sirene2.m4a"),
  highscoreSound: new Sound("./audio/new-highscore.m4a"),
  gameOverSound: new Sound("./audio/game-over.m4a"),
  introSound: new Sound("./audio/intro.m4a"),
  loseLifeSound: new Sound("./audio/-1life.m4a"),
};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { Resources, ResourceLoader };
