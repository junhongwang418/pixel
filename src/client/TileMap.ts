import * as PIXI from "pixi.js";
import BoundingBox from "./BoundingBox";

class Tile extends PIXI.Sprite {
  public static readonly SIZE = 16;

  constructor(id: number) {
    super(PIXI.Loader.shared.resources[`assets/tiles/tile_${id}.png`].texture);
    BoundingBox.shared.add(this);
  }
}

class TileMap extends PIXI.Container {
  private tiles: (Tile | null)[][];

  constructor() {
    super();

    const data = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, 1, 2, 2, 2, 3, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, 1, 2, 2, 2, 3, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.tiles = data.map((row, r) =>
      row.map((_, c) => {
        if (data[r][c] !== -1) {
          const tile = new Tile(data[r][c]);
          tile.x = c * Tile.SIZE;
          tile.y = r * Tile.SIZE;
          this.addChild(tile);
          return tile;
        }
        return null;
      })
    );
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
