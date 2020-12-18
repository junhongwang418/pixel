import * as PIXI from "pixi.js";
import BoundingBox from "./BoundingBox";
import JsonManager, { TileMapData } from "./JsonManager";
import TextureManager from "./TextureManager";

class Tile extends PIXI.Sprite {
  public static readonly SIZE = 48;

  /**
   * Create {@link Tile} from an id. Tile id starts from 1.
   *
   * @param id Tile id
   */
  private constructor(texture: PIXI.Texture) {
    super(texture);
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
    return new Tile(texture);
  }
}

class TileMap extends PIXI.Container {
  public readonly data: TileMapData;
  private tiles: (Tile | null)[][];

  /**
   * Create set of tiles based on tile map json file.
   */
  constructor() {
    super();

    const tileMapData = JsonManager.shared.getTileMapData();
    this.data = tileMapData;

    const height = tileMapData.layers[0].height;
    const width = tileMapData.layers[0].width;
    const data = tileMapData.layers[0].data;

    this.tiles = new Array(height);
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = new Array(width);
      for (let j = 0; j < this.tiles[i].length; j++) {
        const tileId = data[i * width + j];
        if (tileId > 0) {
          const tile = Tile.fromId(tileId);
          tile.x = j * Tile.SIZE;
          tile.y = i * Tile.SIZE;
          this.addChild(tile);
          this.tiles[i][j] = tile;
        } else {
          this.tiles[i][j] = null;
        }
      }
    }
  }

  /**
   * Get the tile by the world coordinates.
   *
   * @param x X position in pixels
   * @param y Y position in pixels
   */
  public getTileAtPoint(x: number, y: number): Tile | null {
    return this.getTileAtPosition(
      Math.floor(x / Tile.SIZE),
      Math.floor(y / Tile.SIZE)
    );
  }

  /**
   * Get the tile by index position. The index starts from top left.
   *
   * ```
   * ------------------ ...
   * |        |
   * | (0, 0) | (1, 0)
   * |        |
   * ------------------ ...
   * |        |
   * | (0, 1) | (1, 1)
   * |        |
   *
   * ```
   *
   * @param tileIndexX Index in x axis
   * @param tileIndexY Index in y axis
   */
  public getTileAtPosition(
    tileIndexX: number,
    tileIndexY: number
  ): Tile | null {
    if (tileIndexY < 0 || tileIndexY >= this.tiles.length) {
      return null;
    }

    return this.tiles[tileIndexY][tileIndexX];
  }
}

export default TileMap;
