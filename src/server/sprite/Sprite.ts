import { SpriteJson } from "../../common/sprite/Sprite";

class Sprite {
  public static readonly SIZE = 48;

  public x = 0; // x position in pixels
  public y = 0; // y position in pixels
  public width = Sprite.SIZE; // width in pixels
  public height = Sprite.SIZE; // height in pixels
  public vx = 0; // velocity in x axis in pixels per second
  public vy = 0; // velocity in y axis in pixels per second
  public flipped = false; // whether the sprite is flipped horizontally
  public onGround = false; // whether the sprite is touching the ground

  /**
   * Get center of the bounds.
   */
  public get center(): { x: number; y: number } {
    const b = this.bounds;
    return {
      x: b.x + b.width / 2,
      y: b.y + b.height / 2,
    };
  }

  /**
   * Get the bounds of the sprite with the origin at
   * top left corner.
   */
  public get bounds(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public applyJson(json: SpriteJson) {
    const { x, y, width, height, vx, vy, flipped, onGround } = json;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.flipped = flipped;
    this.onGround = onGround;
  }

  public json(): SpriteJson {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vx: this.vx,
      vy: this.vy,
      flipped: this.flipped,
      onGround: this.onGround,
    };
  }

  /**
   * {@link Sprite.tick} is called every frame to update the position
   * based on the velocity.
   */
  public tick() {
    this.x += (this.vx * 16.66) / 1000;
    this.y += (this.vy * 16.66) / 1000;
  }
}

export default Sprite;
