import * as PIXI from "pixi.js";
import TextureManager from "./manager/TextureManager";
import JsonManager from "./manager/JsonManager";
import SoundManager from "./manager/SoundManager";
import Controller from "./controller/Controller";
import Keyboard from "./input/Keyboard";
import Mouse from "./input/Mouse";

/**
 * Entry point of PixiJS application. Call {@link App.start} to
 * initializes the game and enter the game loop.
 *
 * This class manages the current {@link Controller} of the game. It
 * invokes {@link Controller.tick} method every frame.
 *
 * {@link Keyboard.tick} is invoked every frame, so keyboard events
 * are listened in any controller.
 */
class App extends PIXI.Application {
  private static CURSOR_DEFAULT_FILE_PATH = "assets/ui/cursor_default.png";

  public static shared = new App();

  private controller: Controller;
  private tick: () => void;

  /**
   * The application will create a renderer using WebGL, if possible,
   * with a fallback to a canvas render. It will also setup the ticker
   * and the root stage PIXI.Container.
   */
  constructor() {
    super();

    // Disable interpolation when scaling because this game uses pixelart.
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // set custom cursor
    this.renderer.plugins.interaction.cursorStyles.default = `url(${App.CURSOR_DEFAULT_FILE_PATH}), auto`;

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(this.view);

    TextureManager.shared.init();
    SoundManager.shared.init();
    JsonManager.shared.init();

    // listen to mouse events
    this.stage.interactive = true;
    this.stage.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.viewport.width,
      this.viewport.height
    );

    Mouse.shared.init(this.stage);
  }

  /**
   * Get the application window size.
   */
  public get viewport() {
    return {
      width: this.renderer.width,
      height: this.renderer.height,
    };
  }

  /**
   * Replace current controller with the new controller.
   *
   * @param controller The new controller
   */
  public setController(controller: Controller) {
    // remove old view and tick
    if (this.controller != null) {
      this.stage.removeChild(this.controller);
      this.ticker.remove(this.tick);
    }

    // set new view and tick
    this.controller = controller;
    this.tick = () => {
      controller.tick();
      Keyboard.shared.tick();
    };
    this.stage.addChild(controller);
    controller.start();
    this.ticker.add(this.tick);
  }
}

export default App;
