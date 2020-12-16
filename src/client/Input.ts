import * as PIXI from "pixi.js";
import App from "./App";
import Keyboard from "./Keyboard";
import Text from "./Text";

/**
 * PixiJS implementation of {@link HTMLInputElement}.
 */
class Input extends PIXI.Container {
  private static readonly BACKSPACE_TIMER = 120;

  private text: Text;
  private cursorLine: PIXI.Graphics;
  private box: PIXI.Graphics;
  private maxChars: number;

  private toggleCursorLineInterval: NodeJS.Timeout;
  private backspaceTimer: number;

  private focused: boolean;
  private clicked: boolean;

  constructor(maxChars: number) {
    super();

    this.focused = false;
    this.maxChars = maxChars;

    const fakeText = new Text("-".repeat(maxChars));

    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xffffff);
    this.box.drawRect(0, 0, fakeText.width + 16, fakeText.height);

    this.text = new Text("");
    this.text.x = this.box.width / 2;

    this.cursorLine = new PIXI.Graphics();
    this.cursorLine.lineStyle(1, 0xffffff);
    this.cursorLine.lineTo(0, fakeText.height);
    this.cursorLine.closePath();
    this.cursorLine.alpha = 0;

    this.addChild(this.box);
    this.box.addChild(this.text);
    this.text.addChild(this.cursorLine);

    this.toggleCursorLineInterval = setInterval(() => {
      if (this.focused) {
        this.cursorLine.alpha = this.cursorLine.alpha ? 0 : 1;
      }
    }, 500);

    this.backspaceTimer = 0;

    // register click events
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    this.on("pointerdown", this.onClickSelf);
    App.shared.addClickCallback(this.onClickApp);
  }

  /**
   * Callback to trigger when the input box is clicked. This will activate
   * the listener for keyboard events and allow the user to type into the
   * text box.
   */
  private onClickSelf = () => {
    this.focus(true);
    this.clicked = true;
  };

  /**
   * Callback to trigger when the game window is clicked. Combined with
   * {@link Input.onClickSelf}, this will deactivate the listener for
   * keyboard events when the user clicks outside the text box.
   */
  private onClickApp = () => {
    if (this.clicked) {
      this.clicked = false;
    } else {
      this.focus(false);
    }
  };

  public tick = () => {
    if (!this.focused) {
      return;
    }

    const inputChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?";
    inputChars.split("").forEach((c) => {
      const key = Keyboard.shared.getKey(c);
      if (key.isPressed && this.text.text.length < this.maxChars) {
        this.text.text += c;
        this.cursorLine.x = this.text.width;
        this.text.x = this.box.width / 2 - this.text.width / 2;
      }
    });

    const backspaceKey = Keyboard.shared.getKey("Backspace");
    if (backspaceKey.isDown) {
      if (this.backspaceTimer === 0) {
        this.text.text = this.text.text.slice(0, -1);
        this.cursorLine.x = this.text.width;
        this.text.x = this.box.width / 2 - this.text.width / 2;
        this.backspaceTimer = Input.BACKSPACE_TIMER;
      } else {
        this.backspaceTimer = Math.max(
          this.backspaceTimer - PIXI.Ticker.shared.elapsedMS,
          0
        );
      }
    } else {
      this.backspaceTimer = 0;
    }
  };

  public get value() {
    return this.text.text;
  }

  public destroy() {
    clearInterval(this.toggleCursorLineInterval);
    this.removeListener("pointerdown", this.onClickSelf);
    App.shared.removeClickCallback(this.onClickApp);
    super.destroy();
  }

  /**
   * When focused, show the cursor to indicate the input is active
   * and is listening for keyboard events. When not focused, hide
   * the cursor and stop listening for the keyboard events.
   *
   * @param focused Whether to focus or not
   */
  public focus(focused: boolean) {
    this.focused = focused;
    this.cursorLine.alpha = focused ? 1 : 0;
  }
}

export default Input;
