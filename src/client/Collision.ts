import Sprite from "./Sprite";

/**
 * A singleton class that handles the collision detection of the game.
 */
class Collision {
  public static shared = new Collision();

  private constructor() {}

  public overlap(sprite1: Sprite, sprite2: Sprite): boolean {
    return this.overlapX(sprite1, sprite2) && this.overlapY(sprite1, sprite2);
  }

  private overlapX(sprite1: Sprite, sprite2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceX = sprite1.width / 2 + sprite2.width / 2;
    const distanceX = Math.abs(
      sprite1.x + sprite1.width / 2 - (sprite2.x + sprite2.width / 2)
    );
    return distanceX < minDistanceX;
  }

  private overlapY(sprite1: Sprite, sprite2: Sprite): boolean {
    // minimum distance from center required for separation
    const minDistanceY = sprite1.height / 2 + sprite2.height / 2;
    const distanceY = Math.abs(
      sprite1.y + sprite1.height / 2 - (sprite2.y + sprite2.height / 2)
    );
    return distanceY < minDistanceY;
  }
}

export default Collision;
