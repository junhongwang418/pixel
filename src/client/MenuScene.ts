import Keyboard from "./Keyboard";
import PlayScene from "./PlayScene";
import Scene from "./Scene";
import SceneManager from "./SceneManager";
import Text from "./Text";

class MenuScene extends Scene {
  private tutorial: Text;
  private prompt: Text;

  constructor() {
    super();

    this.prompt = new Text("Press Enter to Start");
    this.prompt.x = window.innerWidth / 2 - this.prompt.width / 2;
    this.prompt.y = window.innerHeight / 2 + 100;

    this.tutorial = new Text(
      `
      [How to Play]
        W: Jump
        A: Left
        D: Right
        J: Attack
    `,
      { fontSize: 24 }
    );
    this.tutorial.x = window.innerWidth / 2 - this.prompt.width / 2;
    this.tutorial.y = window.innerHeight / 2 - 100;

    this.addChild(this.prompt);
    this.addChild(this.tutorial);
  }

  public start() {}

  public tick() {
    const enter = Keyboard.shared.getKey("Enter");
    if (enter.isDown) {
      SceneManager.shared.setScene(new PlayScene());
    }

    Keyboard.shared.tick();
  }
}

export default MenuScene;
