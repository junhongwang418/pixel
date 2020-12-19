import * as PIXI from "pixi.js";

/**
 * {@link PIXI.Text} wrapper. This class provides configs
 * and methods specifically for this game.
 */
class Text extends PIXI.Text {
  constructor(
    text?: string,
    options?: {
      fontSize?: number;
      color?: number;
      wrap?: boolean;
      wrapWidth?: number;
    }
  ) {
    super(
      text || "",
      new PIXI.TextStyle({
        fontFamily: "Roboto Mono",
        fontSize: options?.fontSize || 16,
        fill: options?.color || 0xffffff,
        wordWrap: options?.wrap || false,
        wordWrapWidth: options?.wrapWidth || 200,
      })
    );
  }

  // empty string does not have width 0
  public get metrics() {
    return PIXI.TextMetrics.measureText(this.text, this.style);
  }
}

export default Text;
