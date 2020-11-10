import * as PIXI from "pixi.js";

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
   * Returns true if the sprites' bounds intersect.
   *
   * @param {PIXI.Sprite} s1 the first sprite
   * @param {PIXI,Sprute} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect.
   */
  public overlap(s1: PIXI.Sprite, s2: PIXI.Sprite): boolean {
    return this.overlapX(s1, s2) && this.overlapY(s1, s2);
  }

  /**
   * Returns true if the sprites' bounds intersect in x axis.
   *
   * @param {PIXI.Sprite} s1 the first sprite
   * @param {PIXI,Sprute} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect in x axis
   */
  private overlapX(s1: PIXI.Sprite, s2: PIXI.Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceX = s1.width / 2 + s2.width / 2;
    const distanceX = Math.abs(s1.x + s1.width / 2 - (s2.x + s2.width / 2));
    return distanceX < minDistanceX;
  }

  /**
   * Returns true if the sprites' bounds intersect in y axis.
   *
   * @param {PIXI.Sprite} s1 the first sprite
   * @param {PIXI,Sprute} s2 the second sprite
   * @return {boolean} true if s1 and s2 intersect in y axis
   */
  private overlapY(s1: PIXI.Sprite, s2: PIXI.Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceY = s1.height / 2 + s2.height / 2;
    const distanceY = Math.abs(s1.y + s1.height / 2 - (s2.y + s2.height / 2));
    return distanceY < minDistanceY;
  }
}

export default Collision;
