import * as PIXI from "pixi.js";
import Sprite, { BodyType } from "./Sprite";

class Tile extends Sprite {
  constructor(id: number) {
    super(
      {
        tile: [
          PIXI.Loader.shared.resources[`assets/tiles/tile_${id}.png`].texture,
        ],
      },
      BodyType.Static
    );
  }
}

export default Tile;
