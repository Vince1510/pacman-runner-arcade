import { ImageSource, Loader, Resource } from "excalibur";

const Resources = {
  pacmanClosed: new ImageSource("./images/pacman/1.png"),
  pacmanHalf: new ImageSource("./images/pacman/2.png"),
  pacmanOpen: new ImageSource("./images/pacman/3.png"),

  blinky: new ImageSource("./images/ghosts/blinky.png"),
  pinky: new ImageSource("./images/ghosts/pinky.png"),
  inky: new ImageSource("./images/ghosts/inky.png"),
  clyde: new ImageSource("./images/ghosts/clyde.png"),
};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { Resources, ResourceLoader };
