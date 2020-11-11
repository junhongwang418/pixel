import Player from "./Player";
import Sprite from "./Sprite";

/**
 * A singleton class that handles the collision detection of the game.
 * @class
 *
 * @constructor
 */
class Collision {
  public static shared = new Collision();

  private constructor() {}

  /**
   * Make sure collision works and separate dynamic bodies from static bodies.
   * If a dynamic body intersects with a static body in both x and y axises,
   * then it separates them by either pushing back the dynamic body in x or y axis,
   * whichever takes less movement.
   *
   * @param {Player} player the dynamic body
   * @param {Sprite[]} tiles the static bodies
   */
  public tick(player: Player, tiles: Sprite[]) {
    tiles.forEach((tile) => {
      if (this.overlap(player, tile)) {
        // separate the player and the tile
        const minDistanceX = player.width / 2 + tile.width / 2;
        const distanceX = tile.center.x - player.center.x;
        const overlapX = minDistanceX - distanceX;

        const minDistanceY = player.height / 2 + tile.height / 2;
        const distanceY = tile.center.y - player.center.y;
        const overlapY = minDistanceY - distanceY;

        if (Math.abs(overlapX) < Math.abs(overlapY)) {
          player.x -= overlapX;
          player.vx = 0;
        } else {
          player.y -= overlapY;
          player.vy = 0;
        }
      }
    });
  }

  /**
   * Returns true if the sprites' bounds intersect.
   *
   * @param {Sprite} s1 the first sprite
   * @param {Sprite} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect.
   */
  public overlap(s1: Sprite, s2: Sprite): boolean {
    return this.overlapX(s1, s2) && this.overlapY(s1, s2);
  }

  /**
   * Returns true if the sprites' bounds intersect in x axis.
   *
   * @param {Sprite} s1 the first sprite
   * @param {Sprite} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect in x axis
   */
  private overlapX(s1: Sprite, s2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceX = s1.width / 2 + s2.width / 2;
    const distanceX = Math.abs(s1.center.x - s2.center.x);
    return distanceX < minDistanceX;
  }

  /**
   * Returns true if the sprites' bounds intersect in y axis.
   *
   * @param {Sprite} s1 the first sprite
   * @param {Sprite} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect in y axis
   */
  private overlapY(s1: Sprite, s2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceY = s1.height / 2 + s2.height / 2;
    const distanceY = Math.abs(s1.center.y - s2.center.y);
    return distanceY < minDistanceY;
  }
}

export default Collision;
