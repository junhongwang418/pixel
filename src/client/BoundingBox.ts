import * as PIXI from "pixi.js";

/**
 * A singleton class that handles drawing bounding boxes around sprites
 * for debugging purpose.
 */
class BoundingBox {
  public static shared = new BoundingBox();

  private constructor() {}

  /**
   * Add a bounding box to given sprite.
   *
   * @param sprite The sprite to add bounding box to
   */
  public add(sprite: PIXI.Sprite) {
    const box = new PIXI.Graphics();
    box.lineStyle(0.5, 0xffffff);
    box.tint = 0x00ff00;
    box.drawRect(0, 0, sprite.width, sprite.height);
    sprite.addChild(box);
  }
}

export default BoundingBox;
