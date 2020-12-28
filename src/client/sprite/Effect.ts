import Sprite from "./Sprite";
import TextureManager from "../TextureManager";

/**
 * A player attack effect. Enemies receive damages if
 * they overlap with {@link Effect}.
 */
class Effect extends Sprite {
  /**
   * Initilize with position. Assume {@link Effect} is added
   * to the child of {@link Player}, so the position is
   * relative to the player.
   *
   * @param x Relative position to the player initiating the attack in x axis
   * @param y Relative position to the player initiating the attack in y axis
   */
  constructor(x: number, y: number) {
    super(TextureManager.shared.getPunchEffectTextures());
    this.x = x;
    this.y = y;
  }
}

export default Effect;
