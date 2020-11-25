import * as PIXI from "pixi.js";

/**
 * A {@link Sprite} body is either {@link BodyType.Dynamic} or {@link BodyType.Static}.
 * Use dynamic bodies to be pulled down by gravity. Use static bodies to ignore gravity
 * but interact with dynamic bodies.
 */
export enum BodyType {
  Dynamic,
  Static,
}

/**
 * A sprite class with physics and animation support.
 */
class Sprite extends PIXI.Sprite {
  private static readonly ANIMATION_FRAME_PER_MS = 100;

  private animationInterval: NodeJS.Timeout | null;
  private animationIndex = 0;

  protected currTextures: PIXI.Texture[];
  protected texturesMap: { [key: string]: PIXI.Texture[] };

  public collisionBox: PIXI.Graphics;
  public touchingBottom = false;
  public vx = 0; // velocity x
  public vy = 0; // velocity y
  public bodyType: BodyType;

  public constructor(
    texturesMap: { [key: string]: PIXI.Texture[] },
    bodyType: BodyType
  ) {
    super();

    this.texturesMap = texturesMap;
    this.currTextures = Object.values(texturesMap)[0] || [];
    this.texture = this.currTextures[0];
    this.bodyType = bodyType;

    this.collisionBox = new PIXI.Graphics();
    this.collisionBox.lineStyle(0.5, 0xffffff);
    this.collisionBox.tint = 0x00ff00;
    this.collisionBox.drawRect(0, 0, this.width, this.height);
    this.addChild(this.collisionBox);

    this.play();
  }

  /**
   * Start animation
   */
  public play() {
    // already animating
    if (this.animationInterval) return;

    this.animationInterval = setInterval(() => {
      this.animationIndex =
        (this.animationIndex + 1) % this.currTextures.length;
      this.texture = this.currTextures[this.animationIndex];
    }, Sprite.ANIMATION_FRAME_PER_MS);
  }

  /**
   * Stop animation
   */
  public stop() {
    // already stopped
    if (!this.animationInterval) return;

    clearInterval(this.animationInterval);

    this.animationInterval = null;
  }

  public get center(): { x: number; y: number } {
    return {
      x: this.x + (this.width / 2) * this.scale.x,
      y: this.y + (this.height / 2) * this.scale.y,
    };
  }

  /**
   * Update current set of textures and reset animation frame from start.
   *
   * @param textures The new textures
   */
  public setCurrTextures(textures: PIXI.Texture[]) {
    this.currTextures = textures;
    this.animationIndex = 0;
  }
}

export default Sprite;
