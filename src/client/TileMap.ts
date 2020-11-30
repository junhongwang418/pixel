import * as PIXI from "pixi.js";
import BoundingBox from "./BoundingBox";

interface TileMapData {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
  }[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tileversion: string;
  tileheight: number;
  tilesets: {
    columns: number;
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
  }[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
}

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

    const tileMapData = PIXI.Loader.shared.resources["assets/map/map.json"]
      .data as TileMapData;

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
