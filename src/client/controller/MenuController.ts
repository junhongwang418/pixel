import * as PIXI from "pixi.js";
import PlayController from "./PlayController";
import Controller from "./Controller";
import Text, { FontSize } from "../ui/Text";
import Input from "../ui/Input";
import App from "../App";
import Button from "../ui/Button";
import Div from "../ui/Div";
import Color from "../Color";
import Paragraph from "../ui/Paragraph";

/**
 * View for {@link MenuController}.
 */
class MenuView extends PIXI.Container {
  private nameText: Paragraph;
  private tutorialText: Paragraph;
  private promptText: Paragraph;

  constructor(nameInput: Input, playButton: Button) {
    super();

    const viewportWidth = App.shared.viewport.width;
    const viewportHeight = App.shared.viewport.height;

    this.promptText = new Paragraph("Enter your name and click PLAY", {
      color: Color.WHITE,
      fontSize: FontSize.Medium,
    });
    this.promptText.x = viewportWidth / 2 - this.promptText.width / 2;
    this.promptText.y = viewportHeight / 2 + 100;

    this.tutorialText = new Paragraph(
      `[How to Play]\nW: Jump\nA: Left\nD: Right\nJ: Attack`,
      { color: Color.WHITE, fontSize: FontSize.Medium }
    );
    this.tutorialText.x = viewportWidth / 2 - this.tutorialText.width / 2;
    this.tutorialText.y = viewportHeight / 2 - 100;

    this.nameText = new Paragraph("Name", {
      color: Color.WHITE,
      fontSize: FontSize.Medium,
    });
    this.nameText.x = viewportWidth / 2 - this.nameText.width / 2;
    this.nameText.y = this.tutorialText.y - 100;

    nameInput.x = viewportWidth / 2 - nameInput.width / 2;
    nameInput.y = this.nameText.y + 30;

    playButton.x = viewportWidth / 2 - playButton.width / 2;
    playButton.y = this.promptText.y + 50;

    this.addChild(this.promptText);
    this.addChild(this.tutorialText);
    this.addChild(this.nameText);
    this.addChild(nameInput);
    this.addChild(playButton);
  }
}

/**
 * Prompt the player to enter their name and start the game.
 */
class MenuController extends Controller {
  private nameInput: Input;
  private playButton: Button;
  private menuView: MenuView;

  constructor() {
    super();
    this.nameInput = new Input(10, {
      center: true,
      color: Color.WHITE,
      fontSize: FontSize.Medium,
      borderWidth: 1,
      borderColor: Color.WHITE,
      paddingX: 16,
      paddingY: 8,
    });
    this.playButton = new Button("PLAY", {
      fontSize: FontSize.Medium,
      color: Color.WHITE,
      borderColor: Color.WHITE,
      borderWidth: 1,
      paddingX: 16,
      paddingY: 8,
    });
    this.menuView = new MenuView(this.nameInput, this.playButton);
    this.addChild(this.menuView);
  }

  public start() {
    this.nameInput.setFocused(true);
    this.playButton.onClick(() => {
      if (this.nameInput.getValue()) {
        App.shared.setController(new PlayController(this.nameInput.getValue()));
      }
    });
  }

  public tick = () => {
    this.nameInput.tick();
  };

  public destroy() {
    this.nameInput.destroy();
    super.destroy();
  }
}

export default MenuController;
