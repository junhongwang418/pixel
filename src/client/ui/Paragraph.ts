import Div, { DivOptions } from "./Div";
import Text, { FontSize } from "./Text";

export interface ParagraphOptions extends DivOptions {
  color?: number;
  fontSize?: FontSize;
}

/**
 * Pixi implementation of `HTMLParagraphElement`.
 */
class Paragraph extends Div {
  protected text: Text;

  constructor(text: string, options?: ParagraphOptions) {
    const t = new Text(text, options);
    const paddingX = options?.paddingX || 0;
    const paddingY = options?.paddingY || 0;

    const width = t.width + paddingX * 2;
    const height = t.height + paddingY * 2;

    super(width, height, options);

    this.text = t;
    this.body.addChild(t);
  }
}

export default Paragraph;
