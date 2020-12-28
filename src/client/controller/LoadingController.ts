import * as PIXI from "pixi.js";
import App from "../App";
import MenuController from "./MenuController";
import Controller from "./Controller";
import Text from "../ui/Text";
import Div from "../ui/Div";
import Color from "../Color";

/**
 * View for {@link LoadingController}.
 */
class LoadingView extends PIXI.Container {
  private loadingText: Text;
  private percentageText: Text;

  constructor() {
    super();

    this.loadingText = new Text("Loading...", { color: 0xffffff });
    this.loadingText.x =
      App.shared.viewport.width / 2 - this.loadingText.width / 2;
    this.loadingText.y =
      App.shared.viewport.height / 2 - this.loadingText.height;

    this.percentageText = new Text("", { color: 0xffffff });
    this.setPercentage(0);

    this.addChild(this.loadingText);
    this.addChild(this.percentageText);
  }

  public setPercentage(percentage: number) {
    this.percentageText.text = `${percentage}%`;
    this.percentageText.x =
      App.shared.viewport.width / 2 - this.percentageText.width / 2;
    this.percentageText.y =
      App.shared.viewport.height / 2 + this.percentageText.height;
  }
}

/**
 * Load all the assets needed for the game and display current
 * loading progress to the player. Once all the resources are
 * loaded, it delegates the job to {@link MenuController}.
 */
class LoadingController extends Controller {
  private loadingView: LoadingView;

  constructor() {
    super();
    this.loadingView = new LoadingView();
    this.addChild(this.loadingView);
  }

  public start() {
    const loader = PIXI.Loader.shared;
    loader.load(() => {
      // all the files are loaded
      App.shared.setController(new MenuController());
    });
  }

  public tick = () => {
    const loader = PIXI.Loader.shared;
    loader.onProgress.add((loader) => {
      this.loadingView.setPercentage(Math.round(loader.progress));
    });
  };
}

export default LoadingController;
