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
   * Call this function every frame to enable collision detection.
   *
   * @param {Player} player the dynamic body
   * @param {Sprite[]} tiles the static bodies
   */
  public tick(player: Player, tiles: Sprite[]) {
    tiles.forEach((tile) => this.separate(player, tile));
  }

  /**
   * Make sure collision works and separate dynamic bodies from static bodies.
   * If a dynamic body intersects with a static body in both x and y axises,
   * then it separates them by either pushing back the dynamic body in x or y axis,
   * whichever takes less movement.
   *
   * @param {Sprite} dynamicBody the movable sprite
   * @param {Sprite} staticBody the immovable sprite
   */
  public separate(dynamicBody: Sprite, staticBody: Sprite): void {
    // shortcut if possible
    if (!this.overlap(dynamicBody, staticBody)) return;

    const minDistanceX = dynamicBody.width / 2 + staticBody.width / 2;
    const diffX = staticBody.center.x - dynamicBody.center.x;

    const minDistanceY = dynamicBody.height / 2 + staticBody.height / 2;
    const diffY = staticBody.center.y - dynamicBody.center.y;

    const deltaX = diffX > 0 ? diffX - minDistanceX : diffX + minDistanceX;
    const deltaY = diffY > 0 ? diffY - minDistanceY : diffY + minDistanceY;

    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      dynamicBody.x += deltaX;
      // bounce dynamic body back in x-axis so need to reset vx
      dynamicBody.vx = 0;
    } else {
      dynamicBody.y += deltaY;
      // bounce dynamic body back in y-axis so need to reset vx
      dynamicBody.vy = 0;
    }
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
