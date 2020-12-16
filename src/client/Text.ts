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
    }
  ) {
    super(
      text || "",
      new PIXI.TextStyle({
        fontFamily: "Roboto Mono",
        fontSize: options?.fontSize || 24,
        fill: options?.color || 0xffffff,
      })
    );
  }
}

export default Text;
