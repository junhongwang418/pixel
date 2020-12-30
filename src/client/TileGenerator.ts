import * as PIXI from "pixi.js";

import { ITile, ITileGenerator } from "../server/TileMap";
import BoundingBox from "./BoundingBox";
import Controller from "./controller/Controller";
import TextureManager from "./TextureManager";

class Tile extends PIXI.Sprite implements ITile {
  public static readonly SIZE = 48;

  public id: number;

  /**
   * Create {@link Tile} from an id. Tile id starts from 1.
   *
   * @param id Tile id
   */
  private constructor(id: number, texture: PIXI.Texture) {
    super(texture);
    this.id = id;
    BoundingBox.shared.add(this);
  }

  public static fromId(id: number): Tile {
    const numCols = 17;
    const index = id - 1;
    const size = 48;
    const spritesheet = TextureManager.shared.getGrasslandTileSpritesheet();
    const texture = new PIXI.Texture(
      spritesheet.baseTexture,
      new PIXI.Rectangle(
        size * (index % numCols),
        size * Math.floor(index / numCols),
        size,
        size
      )
    );
    return new Tile(id, texture);
  }
}

class TileGenerator implements ITileGenerator {
  private container: PIXI.Container;

  public constructor(container: PIXI.Container) {
    this.container = container;
  }

  public create(id: number) {
    const tile = Tile.fromId(id);
    this.container.addChild(tile);
    return tile;
  }
}

export default TileGenerator;
