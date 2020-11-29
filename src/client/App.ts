import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import Collision from "./Collision";
import Gravity from "./Gravity";
import Background from "./Background";
import Foreground from "./Foreground";

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
  // filepaths to all the textures needed for the game
  public static readonly ASSETS = [
    "assets/mrman/idle_0.png",
    "assets/mrman/idle_1.png",
    "assets/mrman/idle_2.png",
    "assets/mrman/idle_3.png",
    "assets/mrman/run_0.png",
    "assets/mrman/run_1.png",
    "assets/mrman/run_2.png",
    "assets/mrman/run_3.png",
    "assets/mrman/run_4.png",
    "assets/mrman/run_5.png",
    "assets/mrman/jumping.png",
    "assets/mrman/falling.png",
    "assets/mrman/falling_touch_ground.png",
    "assets/mrman/punch_0.png",
    "assets/mrman/punch_1.png",
    "assets/mrman/punch_2.png",
    "assets/tiles/tile_0.png",
    "assets/tiles/tile_1.png",
    "assets/tiles/tile_2.png",
    "assets/tiles/tile_3.png",
    "assets/backgrounds/grassland/0.png",
    "assets/backgrounds/grassland/1.png",
    "assets/backgrounds/grassland/2.png",
    "assets/backgrounds/grassland/3.png",
    "assets/backgrounds/grassland/4.png",
    "assets/effects/punch/0.png",
    "assets/effects/punch/1.png",
    "assets/effects/punch/2.png",
  ];

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
    loader.add(App.ASSETS);

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
        Gravity.shared.tick(PIXI.Ticker.shared.elapsedMS, [foreground.player]);
        Collision.shared.tick(foreground.player, foreground.tileMap);
        background.tick(foreground.player, viewportWidth);
        foreground.tick(
          PIXI.Ticker.shared.elapsedMS,
          viewportWidth,
          viewportHeight
        );
        Keyboard.shared.tick();
      });
    });
  }
}

export default App;
