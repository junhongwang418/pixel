import Background from "./Background";
import Collision from "./Collision";
import Foreground from "./Foreground";
import Gravity from "./Gravity";
import Keyboard from "./Keyboard";
import Scene from "./Scene";
import SceneManager from "./SceneManager";

class PlayScene extends Scene {
  private background: Background;
  private foreground: Foreground;

  constructor() {
    super();
    this.background = new Background(1024);

    // scale the application view content to fill the background height
    const scale = window.innerHeight / this.background.sourceTextureHeight;
    this.scale.set(scale);

    // reset scale when the window size changes
    window.onresize = () => this.scale.set(scale);

    this.foreground = new Foreground();

    // The root containser contains two containers. Background container
    // is where the background textures are stored (something you as a
    // player can't interact with). Foreground container is where
    // everything else is stored (game objects the player can interact
    // with).
    this.addChild(this.background);
    this.addChild(this.foreground);
  }

  public start() {}

  public tick = () => {
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
}

export default PlayScene;
