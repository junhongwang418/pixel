import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import Collision from "./Collision";
import Gravity from "./Gravity";
import Background from "./Background";
import Foreground from "./Foreground";
import TextureManager from "./TextureManager";

/**
 * Entry point of PixiJS application. Call {@link App.start} to start the game.
 *
 * ```typescript
 * const app = new App();
 * app.start();
 * ```
 *
 * This is where the application initializes the game and enter the game loop.
 */
class App {
  /**
   * Initialize the game and enter the game loop.
   */
  public start(): void {
    // Disable interpolation when scaling, will make texture be pixelated
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application();

    // make the application view full screen
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.view);

    const loader = PIXI.Loader.shared;

    // load all the textures of the game
    TextureManager.shared.init();
    loader.add("assets/map/map.json");

    loader.onProgress.add((loader) => {
      console.log(`progress: ${loader.progress}%`);
    });

    // callback when all the files are loaded
    loader.load(() => {
      console.log("All files loaded");

      const background = new Background(app.renderer.width);

      // scale the application view content to fill the background height
      app.stage.scale.set(app.renderer.height / background.sourceTextureHeight);

      const viewportWidth = app.renderer.width / app.stage.scale.x;
      const viewportHeight = app.renderer.height / app.stage.scale.y;

      const foreground = new Foreground(viewportHeight);

      // The root containser contains two containers. Background container
      // is where the background textures are stored (something you as a
      // player can't interact with). Foreground container is where
      // everything else is stored (game objects the player can interact
      // with).
      app.stage.addChild(background);
      app.stage.addChild(foreground);

      // callback to call every frame
      app.ticker.add(() => {
        Gravity.shared.tick([foreground.player, ...foreground.enemies]);
        Collision.shared.tick(
          foreground.player,
          foreground.enemies,
          foreground.tileMap
        );
        background.tick(foreground.player, viewportWidth);
        foreground.tick(viewportWidth, viewportHeight);
        Keyboard.shared.tick();
      });
    });
  }
}

export default App;
