import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Tile from "./Tile";

class TileMap extends PIXI.Container {
  private data: number[][];
  public tiles: Tile[][];

  constructor() {
    super();

    this.data = [
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

    this.tiles = this.data.map((row, r) =>
      row.map((_, c) => {
        if (this.data[r][c] !== -1) {
          const tile = new Tile(this.data[r][c]);
          tile.x = c * Sprite.SIZE;
          tile.y = r * Sprite.SIZE;
          this.addChild(tile);
          return tile;
        }
        return null;
      })
    );
  }

  public getTileAtPoint(x: number, y: number): Tile {
    return this.getTileAtPosition(
      Math.floor(x / Sprite.SIZE),
      Math.floor(y / Sprite.SIZE)
    );
  }

  public getTileAtPosition(tileIndexX: number, tileIndexY: number): Tile {
    if (tileIndexY < 0 || tileIndexY >= this.tiles.length) {
      return null;
    }

    return this.tiles[tileIndexY][tileIndexX];
  }
}

export default TileMap;
