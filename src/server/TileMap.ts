import Sprite from "./Sprite";
import JsonLoader from "./JsonLoader";
import { TileMapData } from "../client/JsonManager";

class Tile extends Sprite {
  public id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }
}

class TileMap {
  private static readonly TILE_SIZE = 48;

  private tiles: (Tile | null)[][];

  public constructor() {
    const tileMapData = JsonLoader.shared.jsons[
      "dist/client/assets/map/grassland/1.json"
    ] as TileMapData;

    const height = tileMapData.layers[0].height;
    const width = tileMapData.layers[0].width;
    const data = tileMapData.layers[0].data;

    this.tiles = new Array(height);
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = new Array(width);
      for (let j = 0; j < this.tiles[i].length; j++) {
        const tileId = data[i * width + j];
        if (tileId > 0) {
          const tile = new Tile(tileId);
          tile.x = TileMap.TILE_SIZE * j;
          tile.y = TileMap.TILE_SIZE * i;
          tile.width = TileMap.TILE_SIZE;
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
  public getTileIdAtPoint(x: number, y: number): Tile | null {
    return this.getTileIdAtPosition(
      Math.floor(x / TileMap.TILE_SIZE),
      Math.floor(y / TileMap.TILE_SIZE)
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
  public getTileIdAtPosition(
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
