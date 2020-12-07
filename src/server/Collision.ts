import Enemy from "./Enemy";
import TileMap from "./TileMap";

/**
 * A singleton class that handles the collision detection of the game.
 */
class Collision {
  public static shared = new Collision();

  private constructor() {}

  /**
   * Call this function every frame to make sure platformer collision works
   * and push back the player on the ground.
   *
   * @param sprites The sprites to apply the collision
   * @param tileMap The tile map of the world
   */
  public tick(enemies: { [id: string]: Enemy }) {
    Object.values(enemies).forEach((e) => {
      // reset on ground
      e.onGround = false;

      const bottomTile = TileMap.shared.getTileIdAtPoint(
        e.center.x,
        e.y + e.height
      );

      // falling and overlapping with ground
      if (bottomTile && e.vy > 0) {
        e.onGround = true;
        e.vy = 0;
        e.y = bottomTile.y - e.height;
      }
    });
  }
}

export default Collision;
