import * as PIXI from "pixi.js";
import Color from "./Color";
import Text from "./Text";

enum ButtonState {
  Default,
  Hover,
  Down,
}

interface ButtonOptions {
  background?: number;
  backgroundAlpha?: number;
  fontSize?: number;
}

/**
 * View for {@link Button}.
 */
class ButtonView extends PIXI.Container {
  private static readonly PADDING_X = 8;
  private static readonly PADDING_Y = 2;

  private box: PIXI.Graphics;
  private text: Text;

  constructor(text: string, options?: ButtonOptions) {
    super();
    this.text = new Text(text, { fontSize: options?.fontSize });
    this.text.x = ButtonView.PADDING_X;
    this.text.y = ButtonView.PADDING_Y;

    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xffffff);
    this.box.beginFill(
      options?.background || 0x000000,
      options?.backgroundAlpha || 1
    );
    this.box.drawRect(
      0,
      0,
      this.text.width + ButtonView.PADDING_X * 2,
      this.text.height + ButtonView.PADDING_Y * 2
    );
    this.box.endFill();

    this.addChild(this.box);
    this.box.addChild(this.text);
  }

  public setTint(color: number) {
    this.box.tint = color;
    this.text.tint = color;
  }
}

/**
 * PixiJS implementation of {@link HTMLButtonElement}.
 */
class Button extends PIXI.Container {
  private state = ButtonState.Default;
  private clickCallback = () => {};

  private view: ButtonView;

  constructor(text: string, options?: ButtonOptions) {
    super();
    this.view = new ButtonView(text, options);
    this.addChild(this.view);

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
        this.view.setTint(Color.WHITE);
        break;
      case ButtonState.Hover:
        this.view.setTint(Color.LIGHT_BLUE);
        break;
      case ButtonState.Down:
        this.view.setTint(Color.DARK_BLUE);
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
