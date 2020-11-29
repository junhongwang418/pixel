import Sprite, { BodyType } from "./Sprite";

/**
 * A singleton class that handles the gravity of the game.
 * Call {@link Gravity.tick} every frame to enable gravity.
 */
class Gravity {
  // How fast objects fall in pixels per frame
  public static readonly G = 0.98;

  public static shared = new Gravity();

  private constructor() {}

  /**
   * Call this method every frame to pull down all dynamic bodies
   * in the game.
   *
   * @param deltaMs The time it has passed since last frame in milliseconds
   * @param sprites All the sprites in the game
   */
  public tick(deltaMs: number, sprites: Sprite[]) {
    sprites
      .filter((s) => s.bodyType === BodyType.Dynamic)
      .forEach((s) => {
        s.vy += Gravity.G * deltaMs;
      });
  }
}

export default Gravity;
