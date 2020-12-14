import * as PIXI from "pixi.js";
import Text from "./Text";

/**
 * PixiJS implementation of HTMLInputElement.
 */
class Input extends PIXI.Container {
  private text: Text;
  private cursorLine: PIXI.Graphics;
  private box: PIXI.Graphics;
  private maxChars: number;

  private toggleCursorLineInterval: NodeJS.Timeout;

  constructor(maxChars: number) {
    super();

    this.maxChars = maxChars;

    this.box = new PIXI.Graphics();
    this.box.lineStyle(1, 0xffffff);

    const options = {
      fontFamily: "Roboto Mono",
      fontSize: 24,
    };
    const fakeText = new Text("-".repeat(maxChars), options);
    this.box.drawRect(0, 0, fakeText.width + 16, fakeText.height);

    this.text = new Text("", options);
    this.text.x = this.box.width / 2;
    this.cursorLine = new PIXI.Graphics();
    this.cursorLine.lineStyle(1, 0xffffff);
    this.cursorLine.lineTo(0, fakeText.height);
    this.cursorLine.closePath();

    window.addEventListener("keydown", this.handleKeydown);

    this.addChild(this.box);
    this.box.addChild(this.text);
    this.text.addChild(this.cursorLine);

    this.toggleCursorLineInterval = setInterval(() => {
      this.cursorLine.alpha = this.cursorLine.alpha ? 0 : 1;
    }, 500);
  }

  public get value() {
    return this.text.text;
  }

  public destroy() {
    window.removeEventListener("keydown", this.handleKeydown);
    clearInterval(this.toggleCursorLineInterval);
    super.destroy();
  }

  private handleKeydown = (e) => {
    if (e.key === "Backspace") {
      this.text.text = this.text.text.slice(0, -1);
      this.cursorLine.x = this.text.width;
      this.text.x = this.box.width / 2 - this.text.width / 2;
    } else if (e.key === "Enter" || e.key === "Meta" || e.key === " ") {
    } else {
      if (this.text.text.length < this.maxChars) {
        this.text.text += e.key;
        this.cursorLine.x = this.text.width;
        this.text.x = this.box.width / 2 - this.text.width / 2;
      }
    }
  };
}

export default Input;
