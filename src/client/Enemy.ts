import * as PIXI from "pixi.js";
import Random from "./Random";
import Sprite from "./Sprite";

enum EnemyState {
  Idle,
  Run,
}

class Enemy extends Sprite {
  private static readonly MOVE_SPEED = 30;

  private state: EnemyState;

  private timeUntilNextAction: number;

  constructor() {
    super(Enemy.getTextures(EnemyState.Idle));
    this.state = EnemyState.Idle;
    this.setAnimationIntervalMS(128);
    this.resetNextActionTime();
  }

  public tick() {
    super.tick();

    if (this.timeUntilNextAction < 0) {
      this.resetNextActionTime();
      this.setFlipped(Random.choice([true, false]));
      this.setState(Random.choice([EnemyState.Idle, EnemyState.Run]));

      if (this.state === EnemyState.Idle) {
        this.vx = 0;
      } else if (this.state === EnemyState.Run) {
        this.vx = Enemy.MOVE_SPEED * (this.flipped ? 1 : -1);
      }
    }

    this.timeUntilNextAction -= PIXI.Ticker.shared.elapsedMS;
  }

  public resetNextActionTime() {
    this.timeUntilNextAction = Math.random() * 3000;
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

  private static getTextures(state: EnemyState) {
    switch (state) {
      case EnemyState.Idle:
        return [
          PIXI.Loader.shared.resources[`assets/bub/idle_0.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/idle_1.png`].texture,
        ];
      case EnemyState.Run:
        return [
          PIXI.Loader.shared.resources[`assets/bub/run_0.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/run_1.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/run_2.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/run_3.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/run_4.png`].texture,
          PIXI.Loader.shared.resources[`assets/bub/run_5.png`].texture,
        ];
      default:
        return [];
    }
  }
}

export default Enemy;
