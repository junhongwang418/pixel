import { ITile, ITileGenerator } from "./TileMap";

import Sprite from "./sprite/Sprite";

class Tile extends Sprite implements ITile {
  public id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }
}

class TileGenerator implements ITileGenerator {
  public static shared = new TileGenerator();

  private constructor() {}

  public create(id: number) {
    return new Tile(id);
  }
}

export default TileGenerator;
