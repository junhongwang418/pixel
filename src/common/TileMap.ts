/**
 * Data structure of Tile map from
 * [Tiled Map Editor](https://www.mapeditor.org/).
 */
export interface TileMapData {
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

export interface ITile {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ITileGenerator {
  create(id: number): ITile;
}

class TileMap {
  public static readonly TILE_SIZE = 48;

  public data: TileMapData;

  protected tiles: (ITile | null)[][];

  public constructor(tileMapData: TileMapData, tileGenerator: ITileGenerator) {
    this.data = tileMapData;

    const height = tileMapData.layers[0].height;
    const width = tileMapData.layers[0].width;
    const data = tileMapData.layers[0].data;

    this.tiles = new Array(height);

    for (let r = 0; r < this.tiles.length; r++) {
      this.tiles[r] = new Array(width);
      for (let c = 0; c < this.tiles[r].length; c++) {
        const tileId = data[r * width + c];
        if (tileId > 0) {
          const tile = tileGenerator.create(tileId);
          tile.x = TileMap.TILE_SIZE * c;
          tile.y = TileMap.TILE_SIZE * r;
          this.tiles[r][c] = tile;
        } else {
          this.tiles[r][c] = null;
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
  public getTileAtPoint(x: number, y: number): ITile | null {
    return this.getTileAtPosition(
      Math.floor(x / TileMap.TILE_SIZE),
      Math.floor(y / TileMap.TILE_SIZE)
    );
  }

  /**
   * Get the tile by index position. The tile at top left corner
   * has index position of (0, 0).
   *
   * @param tileIndexX Index in x axis
   * @param tileIndexY Index in y axis
   */
  public getTileAtPosition(
    tileIndexX: number,
    tileIndexY: number
  ): ITile | null {
    if (tileIndexY < 0 || tileIndexY >= this.tiles.length) {
      return;
    }
    return this.tiles[tileIndexY][tileIndexX];
  }
}

export default TileMap;
