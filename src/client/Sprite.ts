import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";

/**
 * A sprite class with physics.
 */
class Sprite extends PIXI.AnimatedSprite {
  private static readonly GRAVITY = 0.1;

  protected textureMap: { [key: string]: PIXI.Texture } = {};

  // velocity
  private vx = 0;
  private vy = 0;

  public constructor(textureMap: { [key: string]: PIXI.Texture }) {
    super(Object.values(textureMap));

    this.textureMap = textureMap;
    this.animationSpeed = 0.167;
    this.play();

    // set the origin to center of the object
    this.anchor.set(0.5);
  }

  /**
   * Update state for current frame.
   *
   * @param {number} deltaMs time it took to reach current frame from previous frame in milliseconds
   */
  public tick(deltaMs: number): void {
    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");

    this.vy += Sprite.GRAVITY * deltaMs;

    if (keyA.isDown) {
      this.vx = -1;
      this.scale.x = -1;
    } else if (keyD.isDown) {
      this.vx = 1;
      this.scale.x = 1;
    } else {
      this.vx = 0;
    }

    this.x += this.vx * deltaMs;
    this.y += this.vy * deltaMs;

    // fake collision
    if (this.y >= 100) {
      this.y = 100;
      this.vy = 0;
    }
  }
}

export default Sprite;
