import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import { EnemyState, EnemyJson } from "../server/Enemy";

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
   * @param {EnemyJson} json Properties to apply
   */
  public applyJson(json: EnemyJson): void {
    const { x, y, vx, vy, state, scaleX, onGround } = json;
    this.position.set(x, y);
    this.vx = vx;
    this.vy = vy;
    this.scale.x = scaleX;
    this.setState(state);
    this.onGround = onGround;
  }

  /**
   * Construct an enemy object based on the json.
   *
   * @param json Properties to initialize the player
   */
  public static fromJson(json: EnemyJson): Enemy {
    const enemy = new Enemy();
    enemy.applyJson(json);
    return enemy;
  }

  /**
   * Get a json representing current state of the enemy.
   */
  public get json(): EnemyJson {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vx: this.vx,
      vy: this.vy,
      state: this.state,
      scaleX: this.scale.x,
      onGround: this.onGround,
    };
  }

  private static getTextures(state: EnemyState) {
    switch (state) {
      case EnemyState.Idle:
        return [
          PIXI.Loader.shared.resources[`assets/sprites/bub/idle_0.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/idle_1.png`].texture,
        ];
      case EnemyState.Run:
        return [
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_0.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_1.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_2.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_3.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_4.png`].texture,
          PIXI.Loader.shared.resources[`assets/sprites/bub/run_5.png`].texture,
        ];
      default:
        return [];
    }
  }
}

export default Enemy;
