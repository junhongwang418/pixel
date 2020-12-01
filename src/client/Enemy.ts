import * as PIXI from "pixi.js";
import Sprite from "./Sprite";

class Enemy extends Sprite {
  constructor() {
    super([
      PIXI.Loader.shared.resources[`assets/bub/idle_0.png`].texture,
      PIXI.Loader.shared.resources[`assets/bub/idle_1.png`].texture,
    ]);
    this.setAnimationIntervalMS(200);
  }
}

export default Enemy;
