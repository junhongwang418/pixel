import * as PIXI from "pixi.js";
import WebFontLoader from "../WebFontLoader";

export enum FontSize {
  Small = 16,
  Medium = 18,
  Large = 24,
}

export interface TextOptions {
  color?: number;
  fontSize?: FontSize;
}

/**
 * {@link PIXI.Text} wrapper.
 */
class Text extends PIXI.Text {
  constructor(text: string, options?: TextOptions) {
    const style = new PIXI.TextStyle({
      fontFamily: WebFontLoader.DEFAULT_FONT,
      fontSize: options?.fontSize || FontSize.Small,
      fill: 0xffffff,
    });

    super(text, style);
    this.tint = options?.color;
  }

  /**
   * {@link PIXI.Text.width} returns non zero number when the text is empty
   * (same number as when the text contains only one character). If you
   * expect the width to be zero when the text is empty, then use
   * {@link Text.metrics.width} instead.
   */
  public get metrics() {
    return PIXI.TextMetrics.measureText(this.text, this.style);
  }
}

export default Text;
