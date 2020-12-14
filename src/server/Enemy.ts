import Random from "./Random";
import Sprite, { SpriteJson } from "./Sprite";

export enum EnemyState {
  Idle,
  Run,
}

export interface EnemyJson extends SpriteJson {
  state: EnemyState;
}

class Enemy extends Sprite {
  private static readonly MOVE_SPEED = 60;
  private static readonly MOVE_REGION = 100;

  public state = EnemyState.Idle;

  private timeUntilNextAction = 0;

  private baseX: number;

  /**
   * An enemy can only move between `baseX - MOVE_REGION`
   * and `baseX + MOVE_REGION`.
   *
   * @param baseX The spawn position of the enemy.
   */
  constructor(baseX: number) {
    super();
    this.x = this.baseX = baseX;
  }

  public applyJson(json: EnemyJson) {
    super.applyJson(json);
    const { state } = json;
    this.state = state;
  }

  public json(): EnemyJson {
    return {
      ...super.json(),
      state: this.state,
    };
  }

  public tick() {
    super.tick();

    if (this.timeUntilNextAction < 0) {
      this.resetNextActionTime();

      this.flipped = Random.choice([true, false]);
      this.state = Random.choice([EnemyState.Idle, EnemyState.Run]);

      if (this.state === EnemyState.Idle) {
        this.vx = 0;
      } else if (this.state === EnemyState.Run) {
        this.vx = Enemy.MOVE_SPEED * (this.flipped ? -1 : 1);
      }
    }

    // force stop
    if (this.state === EnemyState.Run) {
      if (
        (this.x < this.baseX - Enemy.MOVE_REGION && this.flipped) ||
        (this.x > this.baseX + Enemy.MOVE_REGION && !this.flipped)
      ) {
        this.state = EnemyState.Idle;
        this.vx = 0;
      }
    }

    this.timeUntilNextAction -= 16.66;
  }

  public resetNextActionTime() {
    this.timeUntilNextAction = Math.random() * 3000;
  }
}

export default Enemy;
