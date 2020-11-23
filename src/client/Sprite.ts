import * as PIXI from "pixi.js";
import App from "./App";

export enum BodyType {
  Dynamic,
  Static,
}

/**
 * A sprite class with physics and animation support.
 */
class Sprite extends PIXI.Sprite {
  private animationInterval: NodeJS.Timeout | null;
  private texureIndex = 0;
  protected textures: PIXI.Texture[];
  protected texturesMap: { [key: string]: PIXI.Texture[] } = {};
  protected collisionBox: PIXI.Graphics;

  public touchingBottom: boolean = false;

  // velocity
  public vx = 0;
  public vy = 0;

  public bodyType: BodyType;

  public constructor(
    texturesMap: { [key: string]: PIXI.Texture[] },
    bodyType?: BodyType
  ) {
    super(
      Object.values(texturesMap)[0]
        ? Object.values(texturesMap)[0][0]
        : undefined
    );

    this.textures = Object.values(texturesMap)[0];
    this.texturesMap = texturesMap;
    this.bodyType = bodyType || BodyType.Dynamic;

    // initialize collision box
    this.collisionBox = new PIXI.Graphics();
    this.collisionBox.lineStyle(0.5, 0xffffff);
    this.collisionBox.drawRect(0, 0, this.width, this.height);
    this.addChild(this.collisionBox);
  }

  /**
   * Start animation
   */
  public play() {
    // already animating
    if (this.animationInterval) return;

    this.animationInterval = setInterval(() => {
      this.texureIndex = (this.texureIndex + 1) % this.textures.length;
      this.texture = this.textures[this.texureIndex];
    }, 100);
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

  public setHit(hit: boolean) {
    if (hit) {
      this.collisionBox.tint = 0xff0000;
    } else {
      this.collisionBox.tint = 0xffffff;
    }
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
  public setTextures(textures: PIXI.Texture[]) {
    this.textures = textures;
    this.texureIndex = 0;
  }
}

export default Sprite;
