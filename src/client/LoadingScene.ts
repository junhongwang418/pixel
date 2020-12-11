import * as PIXI from "pixi.js";
import MenuScene from "./MenuScene";
import Scene from "./Scene";
import SceneManager from "./SceneManager";
import Text from "./Text";

class LoadingScene extends Scene {
  private percentage: Text;

  constructor() {
    super();

    const loading = new Text("Loading...");
    loading.x = window.innerWidth / 2 - loading.width / 2;
    loading.y = window.innerHeight / 2 - loading.height;

    this.percentage = new Text("0%");
    this.percentage.x = window.innerWidth / 2 - this.percentage.width / 2;
    this.percentage.y = window.innerHeight / 2 + this.percentage.height;

    this.addChild(loading);
    this.addChild(this.percentage);
  }

  public start() {
    const loader = PIXI.Loader.shared;
    loader.load(() => {
      // all the files are loaded
      SceneManager.shared.setScene(new MenuScene());
    });
  }

  public tick = () => {
    const loader = PIXI.Loader.shared;
    loader.onProgress.add((loader) => {
      this.setPercentage(Math.round(loader.progress));
    });
  };

  private setPercentage(percentage: number) {
    this.percentage.text = `${percentage}%`;
    this.percentage.x = window.innerWidth / 2 - this.percentage.width / 2;
  }
}

export default LoadingScene;
