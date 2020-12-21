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
    const isDev = process.env.MODE === "development";
    if (isDev) {
      const box = new PIXI.Graphics();
      const green = 0x00ff00;
      box.lineStyle(2, 0xffffff);
      box.tint = green;
      box.drawRect(0, 0, sprite.width, sprite.height);
      sprite.addChild(box);

      // draw pivot point
      const circle = new PIXI.Graphics();
      const red = 0xff0000;
      circle.lineStyle(2, 0xffffff);
      circle.tint = red;
      circle.drawCircle(0, 0, 1);
      sprite.addChild(circle);
    }
  }
}

export default BoundingBox;
