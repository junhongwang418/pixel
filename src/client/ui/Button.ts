import * as PIXI from "pixi.js";
import Color from "../Color";
import Paragraph, { ParagraphOptions } from "./Paragraph";

enum ButtonState {
  Default,
  Hover,
  Down,
}

interface ButtonOptions extends ParagraphOptions {}

/**
 * PixiJS implementation of `HTMLButtonElement`.
 */
class Button extends Paragraph {
  private state = ButtonState.Default;
  private clickCallback = () => {};

  constructor(text: string, options?: ButtonOptions) {
    super(text, options);

    // register mouse event callbacks
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    this.on("pointerover", this.onPointerOver);
    this.on("pointerdown", this.onPointerDown);
    this.on("pointerup", this.onPointerUp);
    this.on("pointerout", this.onPointerOut);
  }

  private onPointerOver = () => {
    this.setState(ButtonState.Hover);
  };

  private onPointerDown = () => {
    this.setState(ButtonState.Down);
  };

  private onPointerUp = () => {
    if (this.state === ButtonState.Down) {
      this.setState(ButtonState.Hover);
      this.clickCallback();
    }
  };

  private onPointerOut = () => {
    this.setState(ButtonState.Default);
  };

  /**
   * Set the button state and update the color accordingly.
   *
   * @param state The new button state
   */
  private setState(state: ButtonState) {
    const prevState = state;
    this.state = state;

    switch (state) {
      case ButtonState.Default:
        this.border.tint = Color.WHITE;
        this.text.tint = Color.WHITE;
        break;
      case ButtonState.Hover:
        this.border.tint = Color.LIGHT_BLUE;
        this.text.tint = Color.LIGHT_BLUE;
        break;
      case ButtonState.Down:
        this.border.tint = Color.DARK_BLUE;
        this.text.tint = Color.DARK_BLUE;
        break;
      default:
        this.state = prevState;
        break;
    }
  }

  /**
   * Register click callback.
   *
   * @param cb The function to invoke when the button is clicked
   */
  public onClick(cb: () => void) {
    this.clickCallback = cb;
  }
}

export default Button;
