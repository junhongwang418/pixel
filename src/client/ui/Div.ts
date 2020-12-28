import * as PIXI from "pixi.js";

export interface DivOptions {
  paddingX?: number;
  paddingY?: number;
  borderWidth?: number;
  borderColor?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
}

/**
 * Pixi implementation of `HTMLDivElement`.
 */
class Div extends PIXI.Container {
  protected border: PIXI.Graphics;
  protected body: PIXI.Container;

  constructor(width: number, height: number, options?: DivOptions) {
    super();

    this.width = width;
    this.height = height;

    this.border = new PIXI.Graphics();
    this.border.lineStyle(options?.borderWidth, 0xffffff);
    this.border.beginFill(options?.backgroundColor, options?.backgroundAlpha);
    this.border.drawRect(0, 0, width, height);
    this.border.endFill();
    this.border.tint = options?.borderColor;

    this.body = new PIXI.Container();
    this.body.x = (options?.borderWidth || 0) + (options?.paddingX || 0);
    this.body.y = (options?.borderWidth || 0) + (options?.paddingY || 0);

    this.addChild(this.border);
    this.addChild(this.body);
  }
}

export default Div;
