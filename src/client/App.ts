import * as PIXI from "pixi.js";
import TextureManager from "./TextureManager";
import JsonManager from "./JsonManager";
import SoundManager from "./SoundManager";
import LoadingScene from "./LoadingScene";
import MenuScene from "./MenuScene";
import SceneManager from "./SceneManager";
import Scene from "./Scene";

/**
 * Entry point of PixiJS application. Instantiate {@link App} to
 * initializes the game and enter the game loop.
 */
class App {
  private app: PIXI.Application;
  private scene: Scene;

  /**
   * Initialize the game and enter the game loop automatically.
   */
  constructor() {
    // Disable interpolation when scaling because all the textures
    // in this game are pixelart.
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    this.app = new PIXI.Application({ resizeTo: window });

    // set custom cursor
    this.app.renderer.plugins.interaction.cursorStyles.default =
      "url(assets/ui/cursor_default.png), auto";

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(this.app.view);

    TextureManager.shared.init();
    SoundManager.shared.init();
    JsonManager.shared.init();
    SceneManager.shared.init(this);

    this.setScene(new LoadingScene());
  }

  /**
   * Viewport is the visible area of the game. Typically viewport is
   * same as the window size. However, when the game is zoomed in,
   * the viewport will be smaller than the window size to scale up
   * everything.
   */
  public get viewport() {
    return {
      width: this.app.renderer.width / this.scene.scale.x,
      height: this.app.renderer.height / this.scene.scale.y,
    };
  }

  /**
   * Set the active scene.
   */
  public setScene(scene: Scene) {
    if (this.scene != null) {
      this.app.stage.removeChild(this.scene);
      this.app.ticker.remove(this.scene.tick);
    }

    this.scene = scene;
    this.app.stage.addChild(scene);
    scene.start();
    this.app.ticker.add(scene.tick);
  }
}

export default App;
