import * as PIXI from "pixi.js";
import App from "../App";

/**
 * A singleton class that manages mouse events on the application window.
 */
class Mouse {
  public static shared = new Mouse();

  private pointerOverCallbacks: { [key: string]: () => void };
  private pointerDownCallbacks: { [key: string]: () => void };
  private pointerUpCallbacks: { [key: string]: () => void };
  private pointerOutCallbacks: { [key: string]: () => void };

  private constructor() {
    this.pointerOverCallbacks = {};
    this.pointerDownCallbacks = {};
    this.pointerUpCallbacks = {};
    this.pointerOutCallbacks = {};
  }

  public init(stage: PIXI.Container) {
    // register callbacks
    stage.on("pointerover", () => {
      Object.values(this.pointerOverCallbacks).forEach((cb) => cb());
    });
    stage.on("pointerdown", () => {
      Object.values(this.pointerDownCallbacks).forEach((cb) => cb());
    });
    stage.on("pointerup", () => {
      Object.values(this.pointerUpCallbacks).forEach((cb) => cb());
    });
    stage.on("pointerout", () => {
      Object.values(this.pointerOutCallbacks).forEach((cb) => cb());
    });
  }

  public addPointerDownCallback(cb: () => void) {
    this.pointerDownCallbacks[cb.toString()] = cb;
  }

  public removePointerDownCallback(cb: () => void) {
    delete this.pointerDownCallbacks[cb.toString()];
  }
}

export default Mouse;
