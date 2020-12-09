import * as PIXI from "pixi.js";
import { SpriteJson } from "../server/Sprite";
import BoundingBox from "./BoundingBox";

/**
 * A sprite class with physics and animation support.
 */
class Sprite extends PIXI.Sprite {
  public static readonly SIZE = 16;

  private animationInterval: NodeJS.Timeout | null;
  private animationIndex = 0;

  protected textures: PIXI.Texture[];

  protected animationIntervalMS = 100;

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

  public tick() {
    this.x += (this.vx * PIXI.Ticker.shared.elapsedMS) / 1000;
    this.y += (this.vy * PIXI.Ticker.shared.elapsedMS) / 1000;
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
    }, this.animationIntervalMS);
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

  /**
   * Get the center of the sprite. This method is useful
   * because the center position is independent of
   * {@link Sprite.flipped}.
   */
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
  }

  protected setAnimationIntervalMS(ms: number) {
    this.animationIntervalMS = ms;
    this.stop();
    this.play();
  }

  protected get flipped() {
    return this.scale.x < 0;
  }

  /**
   * Apply all the properties specified in the json.
   *
   * @param json Properties to apply
   */
  public applyJson(json: SpriteJson) {
    const { x, y, width, height, vx, vy, scaleX, onGround } = json;
    this.position.set(x, y);
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.scale.x = scaleX;
    this.onGround = onGround;
  }

  /**
   * Construct a sprite object based on the json.
   *
   * @param json Properties to initialize the player
   */
  public static fromJson(json: SpriteJson): Sprite {
    const sprite = new Sprite();
    sprite.applyJson(json);
    return sprite;
  }

  /**
   * Get a json representing current state of the sprite.
   */
  public json(): SpriteJson {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vx: this.vx,
      vy: this.vy,
      scaleX: this.scale.x,
      onGround: this.onGround,
    };
  }
}

export default Sprite;
