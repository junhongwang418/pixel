import * as PIXI from "pixi.js";
import Text from "./Text";

/**
 * A {@link PIXI.Container} with click detection.
 */
class Button extends PIXI.Container {
  private box: PIXI.Graphics;
  private text: Text;
  private callback: () => void;

  constructor(text: string) {
    super();

    this.callback = () => {};

    this.text = new Text(text);
    this.text.x = 8;
    this.text.y = 2;

    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xffffff);
    this.box.beginFill(0x000000, 0.72);
    this.box.drawRect(0, 0, this.text.width + 16, this.text.height + 4);
    this.box.endFill();

    this.addChild(this.box);
    this.box.addChild(this.text);

    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    this.on("pointerdown", () => this.callback());
  }

  /**
   * Register click callback.
   *
   * @param callback The function to invoke when the button is clicked
   */
  public onClick(callback: () => void) {
    this.callback = callback;
  }
}

export default Button;
