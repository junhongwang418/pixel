import Sprite from "./Sprite";
import TextureManager from "../manager/TextureManager";
import { EnemyJson, EnemyState } from "../../common/sprite/Enemy";

/**
 * The sprite the player can attack.
 */
class Enemy extends Sprite {
  private state: EnemyState;

  constructor() {
    super(Enemy.getTextures(EnemyState.Idle));
    this.state = EnemyState.Idle;
    this.setAnimationIntervalMS(128);
  }

  /**
   * Update the active textures based on the new enemy state.
   *
   * @param state The new enemy state
   */
  public setState(state: EnemyState) {
    if (this.state === state) return;
    this.state = state;
    this.setTextures(Enemy.getTextures(state));
  }

  /**
   * Apply all the properties specified in the json.
   *
   * @param json Properties to apply
   */
  public applyJson(json: EnemyJson) {
    super.applyJson(json);
    const { state } = json;
    this.setState(state);
  }

  /**
   * Construct an enemy object based on the json.
   *
   * @param json Properties to initialize the enemy
   */
  public static fromJson(json: EnemyJson) {
    const enemy = new Enemy();
    enemy.applyJson(json);
    return enemy;
  }

  /**
   * Get a json representing current state of the enemy.
   */
  public json(): EnemyJson {
    return {
      ...super.json(),
      state: this.state,
    };
  }

  private static getTextures(state: EnemyState) {
    switch (state) {
      case EnemyState.Idle:
        return TextureManager.shared.getBubIdleTextures();
      case EnemyState.Run:
        return TextureManager.shared.getBubRunTextures();
      default:
        return [];
    }
  }
}

export default Enemy;
