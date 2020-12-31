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
  protected options?: any;

  constructor(width: number, height: number, options?: DivOptions) {
    super();

    this.options = options;

    this.border = this.createBorder(width, height, options);

    this.body = new PIXI.Container();
    this.body.x = (options?.borderWidth || 0) + (options?.paddingX || 0);
    this.body.y = (options?.borderWidth || 0) + (options?.paddingY || 0);

    this.addChild(this.border);
    this.addChild(this.body);
  }

  protected resize(width: number, height: number) {
    this.removeChild(this.body);
    this.removeChild(this.border);

    this.border = this.createBorder(width, height, this.options);

    this.addChild(this.border);
    this.addChild(this.body);
  }

  protected createBorder(width: number, height: number, options?: DivOptions) {
    const border = new PIXI.Graphics();
    border.lineStyle(options?.borderWidth, options?.borderColor);
    border.beginFill(options?.backgroundColor, options?.backgroundAlpha);
    border.drawRect(0, 0, width, height);
    border.endFill();
    return border;
  }
}

export default Div;
