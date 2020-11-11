import * as PIXI from "pixi.js";

export enum BodyType {
  Dynamic,
  Static,
}

/**
 * A sprite class with physics.
 * @class
 *
 * @constructor
 */
class Sprite extends PIXI.AnimatedSprite {
  private static readonly GRAVITY = 0.1;

  // update this property to flip the textures
  protected flipped: boolean = false;

  protected textureMap: { [key: string]: PIXI.Texture } = {};
  protected collisionBox: PIXI.Graphics;

  // velocity
  protected vx = 0;
  public vy = 0;

  protected bodyType: BodyType;

  public constructor(
    textureMap: { [key: string]: PIXI.Texture },
    bodyType?: BodyType
  ) {
    super(Object.values(textureMap));

    this.textureMap = textureMap;
    this.animationSpeed = 0.167;
    this.play();

    this.bodyType = bodyType || BodyType.Dynamic;

    // initialize collision box
    const bounds = this.getBounds();
    this.collisionBox = new PIXI.Graphics();
    this.collisionBox.lineStyle(1, 0xffffff);
    this.collisionBox.drawRect(0, 0, bounds.width, bounds.height);
    this.addChild(this.collisionBox);
  }

  public setHit(hit: boolean) {
    if (hit) {
      this.collisionBox.tint = 0xff0000;
    } else {
      this.collisionBox.tint = 0xffffff;
    }
  }

  /**
   * Update state for current frame.
   *
   * @param {number} deltaMs time it took to reach current frame from previous frame in milliseconds
   */
  public tick(deltaMs: number): void {
    this.maybeFlip();

    if (this.bodyType === BodyType.Dynamic) {
      this.vy += Sprite.GRAVITY * deltaMs;
      this.x += this.vx * deltaMs;
      this.y += this.vy * deltaMs;
    }
  }

  /**
   * Flip the textures if necessary.
   */
  private maybeFlip(): void {
    if (this.flipped) {
      this.textures.map((texture) => (texture.rotate = 12));
    } else {
      this.textures.map((texture) => (texture.rotate = 0));
    }
  }
}

export default Sprite;
