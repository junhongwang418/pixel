import * as PIXI from "pixi.js";
import Sprite, { BodyType } from "./Sprite";

class Tile extends Sprite {
  constructor() {
    super(
      {
        tile0: PIXI.Loader.shared.resources["assets/tiles/tile_0.png"].texture,
      },
      BodyType.Static
    );
  }
}

export default Tile;
