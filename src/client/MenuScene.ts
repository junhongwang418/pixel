import Keyboard from "./Keyboard";
import PlayScene from "./PlayScene";
import Scene from "./Scene";
import SceneManager from "./SceneManager";
import Text from "./Text";
import Input from "./Input";

class MenuScene extends Scene {
  private tutorial: Text;
  private prompt: Text;

  private nameLabel: Text;
  private nameTextInput: Input;

  constructor() {
    super();

    const viewportWidth = SceneManager.shared.viewport.width;
    const viewportHeight = SceneManager.shared.viewport.height;

    this.prompt = new Text("Enter your name and press ENTER");
    this.prompt.x = viewportWidth / 2 - this.prompt.width / 2;
    this.prompt.y = viewportHeight / 2 + 100;

    this.tutorial = new Text(
      `[How to Play]\nW: Jump\nA: Left\nD: Right\nJ: Attack`,
      {
        fontSize: 18,
      }
    );
    this.tutorial.x = viewportWidth / 2 - this.tutorial.width / 2;
    this.tutorial.y = viewportHeight / 2 - 100;

    this.nameLabel = new Text("Name");
    this.nameLabel.x = viewportWidth / 2 - this.nameLabel.width / 2;
    this.nameLabel.y = this.tutorial.y - 100;

    this.nameTextInput = new Input(10);
    this.nameTextInput.x = viewportWidth / 2 - this.nameTextInput.width / 2;
    this.nameTextInput.y = this.nameLabel.y + 30;

    this.addChild(this.prompt);
    this.addChild(this.tutorial);
    this.addChild(this.nameLabel);
    this.addChild(this.nameTextInput);
  }

  public start() {}

  public tick = () => {
    const enter = Keyboard.shared.getKey("Enter");
    if (enter.isDown && this.nameTextInput.value) {
      SceneManager.shared.setScene(new PlayScene(this.nameTextInput.value));
      this.destroy();
    }
  };

  public destroy() {
    this.nameTextInput.destroy();
    super.destroy();
  }
}

export default MenuScene;
