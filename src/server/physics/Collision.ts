import Enemy from "../sprite/Enemy";
import Player from "../sprite/Player";
import Sprite from "../sprite/Sprite";
import TileMap from "../../common/TileMap";

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
  public tick(players: Player[], enemies: Enemy[], tileMap: TileMap) {
    [...players, ...enemies].forEach((s) => {
      s.onGround = false;
      const bottomTile = tileMap.getTileAtPoint(s.center.x, s.y + s.height);
      if (bottomTile && s.vy > 0) {
        s.onGround = true;
        s.vy = 0;
        s.y = bottomTile.y - s.height;
      }
    });

    players.forEach((p) => {
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (Collision.shared.overlap(p, e)) {
          p.hurt(e);
          break;
        }
      }
    });
  }

  /**
   * Checks if two sprites intersect.
   *
   * @param s1 The first sprite
   * @param s2 The second sprite
   * @return Whether or not `s1` and `s2` intersect.
   */
  public overlap(s1: Sprite, s2: Sprite): boolean {
    return this.overlapX(s1, s2) && this.overlapY(s1, s2);
  }

  /**
   * Checks if two sprites intersect in x axis.
   *
   * @param s1 The first sprite
   * @param s2 The second sprite
   * @return Whether or not `s1` and `s2` intersect in x axis
   */
  private overlapX(s1: Sprite, s2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceX = s1.width / 2 + s2.width / 2;
    const distanceX = Math.abs(s1.center.x - s2.center.x);
    return distanceX < minDistanceX;
  }

  /**
   * Checks if two sprites intersect in y axis.
   *
   * @param s1 The first sprite
   * @param s2 The second sprite
   * @return Whether or not `s1` and `s2` intersect in y axis
   */
  private overlapY(s1: Sprite, s2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceY = s1.height / 2 + s2.height / 2;
    const distanceY = Math.abs(s1.center.y - s2.center.y);
    return distanceY < minDistanceY;
  }
}

export default Collision;
