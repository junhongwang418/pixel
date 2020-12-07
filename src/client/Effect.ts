import Sprite from "./Sprite";
import TextureManager from "./TextureManager";

class Effect extends Sprite {
  constructor(x: number, y: number) {
    super(TextureManager.shared.getPunchEffectTextures());
    this.x = x;
    this.y = y;
  }
}

export default Effect;
