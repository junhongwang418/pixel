import * as PIXI from "pixi.js";

interface IController {
  start: () => void;
  tick: () => void;
}

/**
 * {@link Controller} handles the game logic of a scene. A controller
 * can have multiple {@link PIXI.Container}s (i.e. views) inside it
 * and is responsible for updating them every frame.
 */
abstract class Controller extends PIXI.Container implements IController {
  /**
   * Called by {@link App.setController} to perform any other
   * initializations that couldn't be done in the constructor.
   */
  abstract start();

  /**
   * Called by {@link App} every tick to perform whatever updates you
   * defined in this method.
   */
  abstract tick();
}

export default Controller;
