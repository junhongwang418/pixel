import * as PIXI from "pixi.js";

interface IScene {
  start: () => void;
  tick: () => void;
}

abstract class Scene extends PIXI.Container implements IScene {
  abstract start();
  abstract tick();

  protected get viewport() {
    return {
      width: window.innerWidth / this.scale.x,
      height: window.innerHeight / this.scale.y,
    };
  }
}

export default Scene;
