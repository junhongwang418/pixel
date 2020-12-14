import * as PIXI from "pixi.js";

interface IScene {
  start: () => void;
  tick: () => void;
  destroy: () => void;
}

abstract class Scene extends PIXI.Container implements IScene {
  abstract start();
  abstract tick();

  public destroy() {
    super.destroy();
  }
}

export default Scene;
