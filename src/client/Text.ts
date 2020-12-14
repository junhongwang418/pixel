import * as PIXI from "pixi.js";

/**
 * {@link PIXI.Text} wrapper. This class provides configs
 * and methods specifically for this game.
 */
class Text extends PIXI.Text {
  constructor(
    text: string,
    options?: {
      fontFamily?: string;
      fontSize?: number;
    }
  ) {
    super(
      text,
      new PIXI.TextStyle({
        fontFamily: options?.fontFamily || "Roboto Mono",
        fontSize: options?.fontSize || 24,
        fill: "#ffffff",
        wordWrap: true,
        wordWrapWidth: 440,
      })
    );
  }
}

export default Text;
