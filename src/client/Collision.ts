import Player from "./Player";
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
   * and push back the player on the ground.
   *
   * @param player The player
   * @param tileMap The tile map of the world
   */
  public tick(player: Player, tileMap: TileMap) {
    // prevent player from going out of the world boundary
    if (player.scale.x < 0 && player.x - player.width < 0) {
      player.x = Sprite.SIZE;
    }

    player.onGround = false;

    const bottomTile = tileMap.getTileAtPoint(
      player.center.x,
      player.y + player.height
    );

    if (bottomTile) {
      if (player.vy > 0) {
        // falling and overlapping with ground
        player.onGround = true;
        player.vy = 0;
        player.y = bottomTile.y - player.height;
      }
    }
  }

  /**
   * If a dynamic body intersects with a static body in both x and y axises,
   * then it separates them by either pushing back the dynamic body in x or y axis,
   * whichever takes less movement.
   *
   * For example, if two sprites are overlapped by 5 pixels in x axis, 10 pixels in
   * y axis, then the dynamic sprite will be pushed back by 5 pixels in x axis to
   * avoid overlap.
   *
   * @param dynamicSprite The movable sprite
   * @param staticSprite The immovable sprite
   */
  public separate(dynamicSprite: Sprite, staticSprite: Sprite): void {
    // shortcut if possible
    if (!this.overlap(dynamicSprite, staticSprite)) return;

    const minDistanceX = dynamicSprite.width / 2 + staticSprite.width / 2;
    const diffX = staticSprite.center.x - dynamicSprite.center.x;

    const minDistanceY = dynamicSprite.height / 2 + staticSprite.height / 2;
    const diffY = staticSprite.center.y - dynamicSprite.center.y;

    // amount to move dynamic body to avoid overlap
    const deltaX = diffX > 0 ? diffX - minDistanceX : diffX + minDistanceX;
    const deltaY = diffY > 0 ? diffY - minDistanceY : diffY + minDistanceY;

    // choose direction that takes less movement
    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      dynamicSprite.x += deltaX;
      // bounce dynamic body back in x-axis so need to reset vx
      dynamicSprite.vx = 0;
    } else {
      dynamicSprite.y += deltaY;
      // bounce dynamic body back in y-axis so need to reset vx
      dynamicSprite.vy = 0;
      dynamicSprite.onGround = true;
    }
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
