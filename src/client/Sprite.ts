import * as PIXI from "pixi.js";
import BoundingBox from "./BoundingBox";

/**
 * A sprite class with physics and animation support.
 */
class Sprite extends PIXI.Sprite {
  public static readonly SIZE = 16;

  private static readonly ANIMATION_FRAME_PER_MS = 100;

  private animationInterval: NodeJS.Timeout | null;
  private animationIndex = 0;

  protected textures: PIXI.Texture[];
  protected flipped: boolean = false;

  public onGround = false;
  public vx = 0; // velocity in x axis in pixels per second
  public vy = 0; // Velocity in y axis in pixels per second

  public constructor(textures?: PIXI.Texture[]) {
    super();
    this.textures = textures || [];
    this.texture = this.textures[0];
    this.play();
    BoundingBox.shared.add(this);
  }

  /**
   * Start the animation
   */
  public play() {
    // already animating
    if (this.animationInterval) return;

    this.animationInterval = setInterval(() => {
      this.animationIndex = (this.animationIndex + 1) % this.textures.length;
      this.texture = this.textures[this.animationIndex];
    }, Sprite.ANIMATION_FRAME_PER_MS);
  }

  /**
   * Stop the animation
   */
  public stop() {
    // already stopped
    if (!this.animationInterval) return;

    clearInterval(this.animationInterval);

    this.animationInterval = null;
  }

  public get center(): { x: number; y: number } {
    const b = this.bounds;
    return {
      x: b.x + b.width / 2,
      y: b.y + b.height / 2,
    };
  }

  /**
   * Get the bounds of the sprite where the `x` and `y` are
   * the top left corner of the sprite. The `x` is different
   * from the default one when the sprite is flipped.
   */
  public get bounds(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    return {
      x: this.x + (this.flipped ? -this.width : 0),
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Update current set of textures and reset animation frame from start.
   *
   * @param textures The new textures
   */
  public setTextures(textures: PIXI.Texture[]) {
    this.textures = textures;
    this.animationIndex = 0;
  }

  /**
   * Update the scale and position of the sprite to flip the texture horizontally.
   *
   * @param flipped Whether the sprite should be flipped or not
   */
  protected setFlipped(flipped: boolean) {
    if (this.flipped === flipped) return;

    this.scale.x *= -1;
    this.position.x -= this.scale.x * this.width;

    this.flipped = flipped;
  }
}

export default Sprite;
