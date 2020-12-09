import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import Collision from "./Collision";
import Gravity from "./Gravity";
import Background from "./Background";
import Foreground from "./Foreground";
import TextureManager from "./TextureManager";
import JsonManager from "./JsonManager";
import SoundManager from "./SoundManager";

/**
 * Entry point of PixiJS application. Instantiate {@link App} to
 * initializes the game and enter the game loop.
 */
class App {
  private app: PIXI.Application;
  private background: Background;
  private foreground: Foreground;

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

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(this.app.view);

    this.init();

    const loader = PIXI.Loader.shared;

    // TODO: Replace this with an actual loading screen
    loader.onProgress.add((loader) => {
      console.log(`progress: ${loader.progress}%`);
    });

    // All the files are loaded and ready to start
    loader.load(this.start);
  }

  /**
   * {@link App.init} is called when {@link App} is instantiated. Use
   * {@link PIXI.Loader} to load all the files needed for this game.
   * {@link App.start} will not be called until all the resources are
   * loaded into memory.
   */
  private init() {
    TextureManager.shared.init();
    SoundManager.shared.init();
    JsonManager.shared.init();
  }

  /**
   * {@link App.start} is called after all the game resources (e.g. map data,
   * textures, etc) are loaded. This is where we create the game scene.
   */
  private start = () => {
    console.log("All files loaded");

    this.background = new Background(this.app.renderer.width);

    // scale the application view content to fill the background height
    const scale =
      this.app.renderer.height / this.background.sourceTextureHeight;
    this.app.stage.scale.set(scale);

    // reset scale when the window size changes
    window.onresize = () => this.app.stage.scale.set(scale);

    this.foreground = new Foreground();

    // The root containser contains two containers. Background container
    // is where the background textures are stored (something you as a
    // player can't interact with). Foreground container is where
    // everything else is stored (game objects the player can interact
    // with).
    this.app.stage.addChild(this.background);
    this.app.stage.addChild(this.foreground);

    // call update every frame
    this.app.ticker.add(this.update);
  };

  /**
   * After {@link App.start}, {@link App.update} is called every frame
   * to update the data in the game.
   */
  private update = () => {
    Gravity.shared.tick([this.foreground.player]);
    Collision.shared.tick(
      this.foreground.player,
      Object.values(this.foreground.enemies),
      this.foreground.tileMap
    );
    this.background.tick(this.foreground.player, this.viewport.width);
    this.foreground.tick(this.viewport.width, this.viewport.height);
    Keyboard.shared.tick();
  };

  /**
   * Viewport is the visible area of the game. Typically viewport is
   * same as the window size. However, when the game is zoomed in,
   * the viewport will be smaller than the window size to scale up
   * everything.
   */
  private get viewport() {
    return {
      width: this.app.renderer.width / this.app.stage.scale.x,
      height: this.app.renderer.height / this.app.stage.scale.y,
    };
  }
}

export default App;
