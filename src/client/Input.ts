import e from "express";
import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Text from "./Text";

interface InputOptions {
  center?: boolean;
  fontSize?: number;
}

/**
 * View for {@link Input}.
 */
class InputView extends PIXI.Container {
  private static readonly CURSOR_LINE_BLINK_INTERVAL_MS = 500;

  private text: Text;
  private cursorLine: PIXI.Graphics;
  private box: PIXI.Graphics;
  private cursorLineBlinkInterval: NodeJS.Timeout | null = null;
  private options?: InputOptions;

  constructor(width: number, height: number, options?: InputOptions) {
    super();

    this.options = options;

    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xffffff);
    this.box.beginFill(0x000000, 0.72);
    this.box.drawRect(0, 0, width + 16, height);
    this.box.endFill();

    this.text = new Text("", { color: 0xffffff, fontSize: options?.fontSize });
    if (options?.center) {
      this.text.x = this.box.width / 2;
    } else {
      this.text.x = 8;
    }

    this.cursorLine = new PIXI.Graphics();
    this.cursorLine.lineStyle(1, 0xffffff);
    this.cursorLine.lineTo(0, height);
    this.cursorLine.closePath();
    this.cursorLine.alpha = 0;

    this.addChild(this.box);
    this.box.addChild(this.text);
    this.text.addChild(this.cursorLine);
  }

  public showCursorLink(show: boolean) {
    this.cursorLine.alpha = show ? 1 : 0;
    if (show) {
      this.cursorLineBlinkInterval = setInterval(() => {
        this.cursorLine.alpha = this.cursorLine.alpha ? 0 : 1;
      }, InputView.CURSOR_LINE_BLINK_INTERVAL_MS);
    } else if (this.cursorLineBlinkInterval) {
      clearInterval(this.cursorLineBlinkInterval);
      this.cursorLineBlinkInterval = null;
    }
  }

  public setText(text: string) {
    this.text.text = text;
    this.cursorLine.x = this.text.metrics.width;
    if (this.options?.center) {
      this.text.x = this.box.width / 2 - this.text.metrics.width / 2;
    }
  }

  public destroy() {
    if (this.cursorLineBlinkInterval) {
      clearInterval(this.cursorLineBlinkInterval);
    }
    super.destroy();
  }
}

/**
 * PixiJS implementation of {@link HTMLInputElement}.
 */
class Input extends PIXI.Container {
  private static readonly BACKSPACE_INTERVAL_MS = 120;
  private static readonly CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split(
    ""
  );

  private value = "";
  private clicked = false;
  private focused = false;
  private backspaceElapsedMS = 0;

  private maxChars: number;
  private view: InputView;

  constructor(maxChars: number, options?: InputOptions) {
    super();

    this.maxChars = maxChars;

    const metrics = new Text("-".repeat(maxChars), {
      fontSize: options?.fontSize,
    }).metrics;

    this.view = new InputView(metrics.width, metrics.height, options);
    this.addChild(this.view);

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
      if (key.isPressed && this.value.length < this.maxChars) {
        this.value += c;
      }
    });

    const backspaceKey = Keyboard.shared.getKey("Backspace");
    if (backspaceKey.isDown) {
      this.backspaceElapsedMS += PIXI.Ticker.shared.elapsedMS;
      if (this.backspaceElapsedMS >= Input.BACKSPACE_INTERVAL_MS) {
        this.value = this.value.slice(0, -1);
        this.backspaceElapsedMS = 0;
      }
    } else {
      this.backspaceElapsedMS = Input.BACKSPACE_INTERVAL_MS;
    }

    this.view.setText(this.value);
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
    this.view.showCursorLink(focused);
  }

  public getFocused() {
    return this.focused;
  }

  private setValue(value: string) {
    this.value = value;
    this.view.setText(this.value);
  }

  public getValue() {
    return this.value;
  }

  public clear() {
    this.setValue("");
  }
}

export default Input;
