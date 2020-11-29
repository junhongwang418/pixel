import * as PIXI from "pixi.js";
import Sprite, { BodyType } from "./Sprite";

export enum TileType {
  Empty,
  Block,
}

class Tile extends Sprite {
  public type: TileType;

  constructor(id: number) {
    super(
      {
        tile: [
          PIXI.Loader.shared.resources[`assets/tiles/tile_${id}.png`].texture,
        ],
      },
      BodyType.Static
    );
    if (id === 0 || id === 1 || id === 2) {
      this.type = TileType.Block;
    } else {
      this.type = TileType.Empty;
    }
  }
}

export default Tile;
