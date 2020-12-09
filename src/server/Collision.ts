import Sprite from "./Sprite";
import TileMap from "./TileMap";

/**
 * A singleton class that handles the collision detection of the game.
 */
class Collision {
  public static shared = new Collision();

  private constructor() {}

  /**
   * Call this function every frame to make sure platformer collision works
   * and push back the sprites on the ground.
   *
   * @param sprites The sprites to apply the collision
   * @param tileMap The tile map of the world
   */
  public tick(sprites: Sprite[], tileMap: TileMap) {
    sprites.forEach((s) => {
      // reset on ground
      s.onGround = false;

      const bottomTile = tileMap.getTileIdAtPoint(s.center.x, s.y + s.height);

      // falling and overlapping with ground
      if (bottomTile && s.vy > 0) {
        s.onGround = true;
        s.vy = 0;
        s.y = bottomTile.y - s.height;
      }
    });
  }
}

export default Collision;
