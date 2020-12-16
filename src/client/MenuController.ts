import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import PlayController from "./PlayController";
import Controller from "./Controller";
import Text from "./Text";
import Input from "./Input";
import App from "./App";

class MenuView extends PIXI.Container {
  private nameText: Text;
  private tutorialText: Text;
  private promptText: Text;

  constructor(nameInput: Input) {
    super();

    const viewportWidth = App.shared.viewport.width;
    const viewportHeight = App.shared.viewport.height;

    this.promptText = new Text("Enter your name and hit ENTER");
    this.promptText.x = viewportWidth / 2 - this.promptText.width / 2;
    this.promptText.y = viewportHeight / 2 + 100;

    this.tutorialText = new Text(
      `[How to Play]\nW: Jump\nA: Left\nD: Right\nJ: Attack`,
      {
        fontSize: 18,
      }
    );
    this.tutorialText.x = viewportWidth / 2 - this.tutorialText.width / 2;
    this.tutorialText.y = viewportHeight / 2 - 100;

    this.nameText = new Text("Name");
    this.nameText.x = viewportWidth / 2 - this.nameText.width / 2;
    this.nameText.y = this.tutorialText.y - 100;

    nameInput.x = viewportWidth / 2 - nameInput.width / 2;
    nameInput.y = this.nameText.y + 30;

    this.addChild(this.promptText);
    this.addChild(this.tutorialText);
    this.addChild(this.nameText);
    this.addChild(nameInput);
  }
}

class MenuController extends Controller {
  private nameInput: Input;
  private menuView: MenuView;

  constructor() {
    super();
    this.nameInput = new Input(10);
    this.menuView = new MenuView(this.nameInput);
    this.addChild(this.menuView);
  }

  public start() {
    this.nameInput.focus(true);
  }

  public tick = () => {
    this.nameInput.tick();
    const enter = Keyboard.shared.getKey("Enter");
    if (enter.isDown && this.nameInput.value) {
      App.shared.setController(new PlayController(this.nameInput.value));
    }
  };

  public destroy() {
    this.nameInput.destroy();
    super.destroy();
  }
}

export default MenuController;
