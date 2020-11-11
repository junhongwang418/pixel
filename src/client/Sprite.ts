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

  protected texturesMap: { [key: string]: PIXI.Texture[] } = {};
  protected collisionBox: PIXI.Graphics;

  // velocity
  public vx = 0;
  public vy = 0;

  protected bodyType: BodyType;

  public constructor(
    texturesMap: { [key: string]: PIXI.Texture[] },
    bodyType?: BodyType
  ) {
    super(Object.values(texturesMap)[0]);

    this.texturesMap = texturesMap;
    this.animationSpeed = 0.167;
    this.play();

    this.bodyType = bodyType || BodyType.Dynamic;

    // initialize collision box
    const bounds = this.getBounds();
    this.collisionBox = new PIXI.Graphics();
    this.collisionBox.lineStyle(0.1, 0xffffff);
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
    if (this.bodyType === BodyType.Dynamic) {
      this.vy += Sprite.GRAVITY * deltaMs;
      this.x += this.vx * deltaMs;
      this.y += this.vy * deltaMs;
    }
  }

  public get center(): { x: number; y: number } {
    return {
      x: this.x + (this.width / 2) * this.scale.x,
      y: this.y + (this.height / 2) * this.scale.y,
    };
  }
}

export default Sprite;
