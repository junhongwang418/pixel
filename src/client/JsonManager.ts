import * as PIXI from "pixi.js";
import { TileMapData } from "./TileMap";

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
