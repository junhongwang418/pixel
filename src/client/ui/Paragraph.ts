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
    super(0, 0, options);

    this.text = new Text(text, options);

    const { width, height } = this.calculateSize();
    this.resize(width, height);

    this.body.addChild(this.text);
  }

  /**
   * Replace the text. Resize the element accordingly.
   *
   * @param text The new text
   */
  public setText(text: string) {
    this.text.text = text;
    const { width, height } = this.calculateSize();
    this.resize(width, height);
  }

  public getText() {
    return this.text.text;
  }

  protected calculateSize(): { width: number; height: number } {
    const paddingX = this.options?.paddingX || 0;
    const paddingY = this.options?.paddingY || 0;

    return {
      width: this.text.metrics.width + paddingX * 2,
      height: this.text.metrics.height + paddingY * 2,
    };
  }
}

export default Paragraph;
