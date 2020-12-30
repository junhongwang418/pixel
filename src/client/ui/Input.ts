import * as PIXI from "pixi.js";
import Keyboard from "../input/Keyboard";
import Mouse from "../input/Mouse";
import Paragraph, { ParagraphOptions } from "./Paragraph";

interface InputCursorOptions {
  color?: number;
}

class InputCursor extends PIXI.Graphics {
  private static readonly BLINK_INTERVAL_MS = 500;

  private blinking = false;
  private blinkInterval: NodeJS.Timeout | null = null;

  constructor(height: number, options?: InputCursorOptions) {
    super();

    this.alpha = 0;

    this.lineStyle(1, 0xffffff);
    this.lineTo(0, height);
    this.closePath();

    if (options?.color != null) {
      this.tint = options?.color;
    }
  }

  public blink(blinking: boolean) {
    if (this.blinking === blinking) {
      return;
    }

    if (blinking) {
      this.alpha = 1;
      this.blinkInterval = setInterval(() => {
        this.alpha = this.alpha ? 0 : 1;
      }, InputCursor.BLINK_INTERVAL_MS);
    } else {
      clearInterval(this.blinkInterval);
      this.alpha = 0;
    }

    this.blinking = blinking;
  }

  public destroy() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
    }
    super.destroy();
  }
}

interface InputOptions extends ParagraphOptions {}

/**
 * PixiJS implementation of {@link HTMLInputElement}.
 */
class Input extends Paragraph {
  private static readonly BACKSPACE_INTERVAL_MS = 120;
  private static readonly CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split(
    ""
  );

  private clicked: boolean;
  private focused: boolean;
  private backspaceElapsedMS: number;
  private maxChars: number;
  private inputCursor: InputCursor;

  constructor(maxChars: number, options?: InputOptions) {
    super("-".repeat(maxChars), options);

    this.maxChars = maxChars;
    this.text.text = "";
    this.clicked = false;
    this.focused = false;
    this.backspaceElapsedMS = 0;

    const inputCursorHeight =
      this.height -
      (options?.paddingY || 0) * 2 -
      (options?.borderWidth || 0) * 2;

    this.inputCursor = new InputCursor(inputCursorHeight, {
      color: options?.color,
    });
    this.body.addChild(this.inputCursor);

    // register click events
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    this.on("pointerdown", this.onPointerDown);
    Mouse.shared.addPointerDownCallback(this.onPointerDownApp);
  }

  /**
   * Callback to trigger when the input box is clicked. This will activate
   * the listener for keyboard events and allow the user to type into the
   * text box.
   */
  private onPointerDown = () => {
    this.setFocused(true);
    this.clicked = true;
  };

  /**
   * Callback to trigger when the application window is clicked. Combined with
   * {@link Input.onPointerDown}, this will deactivate the listener for
   * keyboard events when the user clicks outside the text box.
   */
  private onPointerDownApp = () => {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.setFocused(false);
    }
  };

  public tick = () => {
    if (!this.focused) {
      return;
    }

    Input.CHARACTERS.forEach((c) => {
      const key = Keyboard.shared.getKey(c);
      if (key.isPressed && this.text.text.length < this.maxChars) {
        this.text.text += c;
      }
    });

    const backspaceKey = Keyboard.shared.getKey("Backspace");
    if (backspaceKey.isDown) {
      this.backspaceElapsedMS += PIXI.Ticker.shared.elapsedMS;
      if (this.backspaceElapsedMS >= Input.BACKSPACE_INTERVAL_MS) {
        this.text.text = this.text.text.slice(0, -1);
        this.backspaceElapsedMS = 0;
      }
    } else {
      this.backspaceElapsedMS = Input.BACKSPACE_INTERVAL_MS;
    }

    this.inputCursor.x = this.text.metrics.width;
  };

  public destroy() {
    this.removeListener("pointerdown", this.onPointerDown);
    Mouse.shared.removePointerDownCallback(this.onPointerDownApp);
    super.destroy();
  }

  /**
   * When focused, show the cursor to indicate the input is active
   * and is listening for keyboard events. When not focused, hide
   * the cursor and stop listening for the keyboard events.
   *
   * @param focused Whether to focus or not
   */
  public setFocused(focused: boolean) {
    this.focused = focused;
    this.inputCursor.blink(focused);
  }

  public getFocused() {
    return this.focused;
  }

  private setValue(value: string) {
    this.text.text = value;
  }

  public getValue() {
    return this.text.text;
  }

  public clear() {
    this.setValue("");
  }
}

export default Input;
