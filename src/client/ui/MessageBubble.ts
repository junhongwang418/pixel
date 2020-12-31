import * as PIXI from "pixi.js";
import { DivOptions } from "./Div";
import Paragraph, { ParagraphOptions } from "./Paragraph";

export interface MessageBubbleOptions extends ParagraphOptions {}

class MessageBubble extends Paragraph {
  private static readonly TIP_WIDTH = 8;
  private static readonly TIP_HEIGHT = 8;

  protected calculateSize() {
    const options = this.options as MessageBubbleOptions;

    const paddingX = options?.paddingX || 0;
    const paddingY = options?.paddingY || 0;

    return {
      width: this.text.metrics.width + paddingX * 2,
      height:
        this.text.metrics.height + paddingY * 2 + MessageBubble.TIP_HEIGHT,
    };
  }

  protected createBorder(width: number, height: number, options?: DivOptions) {
    const border = new PIXI.Graphics();
    border.lineStyle(options?.borderWidth, options?.borderColor);
    border.beginFill(options?.backgroundColor, options?.backgroundAlpha);

    border.moveTo(0, 0);
    border.lineTo(width, 0);
    border.lineTo(width, height - MessageBubble.TIP_HEIGHT);
    border.lineTo(
      width / 2 + MessageBubble.TIP_WIDTH / 2,
      height - MessageBubble.TIP_HEIGHT
    );
    border.lineTo(width / 2, height);
    border.lineTo(
      width / 2 - MessageBubble.TIP_WIDTH / 2,
      height - MessageBubble.TIP_HEIGHT
    );
    border.lineTo(0, height - MessageBubble.TIP_HEIGHT);
    border.lineTo(0, 0);
    border.closePath();

    border.endFill();
    return border;
  }
}

export default MessageBubble;
