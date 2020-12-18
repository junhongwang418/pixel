import * as PIXI from "pixi.js";

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

/**
 * A singleton class that manages all json files used in the game
 * similar to like {@link TextureManager}.
 */
class JsonManager {
  public static shared = new JsonManager();

  private constructor() {}

  /**
   * {@link FileManager.init} must be called before the game starts
   * to load all the jsons beforehand.
   */
  public init() {
    const loader = PIXI.Loader.shared;
    loader.add(this.getTileMapFilePath());
  }

  public getTileMapData() {
    return PIXI.Loader.shared.resources[this.getTileMapFilePath()]
      .data as TileMapData;
  }

  private getTileMapFilePath() {
    return "assets/map/grassland/1.json";
  }
}

export default JsonManager;
