import {
  PlayerInput,
  PlayerJson,
  PlayerState,
} from "../../common/sprite/Player";
import App from "../App";
import Enemy from "./Enemy";
import Sprite from "./Sprite";

class Player extends Sprite {
  private static readonly LANDING_DURATION = 100;
  private static readonly JUMP_SPEED = 600;
  private static readonly MOVE_SPEED = 140;
  private static readonly PUNCH_DURATION = 300;
  private static readonly BLINK_DURATION = 2000;
  private static readonly HURT_IMPACT_X = 60;
  private static readonly HURT_IMPACT_Y = 200;
  private static readonly SAYING_DURATION = 2000;

  public name: string;
  public state = PlayerState.Idle;
  public blinking = false;
  public saying = "";

  private landingElapsedMS = 0;
  private punchElapsedMS = 0;
  private sayingTimeout: NodeJS.Timeout | null = null;

  constructor(name: string, x: number, y: number) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
  }

  public applyJson(json: PlayerJson) {
    super.applyJson(json);
    const { state, blinking, name, saying } = json;
    this.state = state;
    this.blinking = blinking;
    this.name = name;
    this.saying = saying;
  }

  public json(): PlayerJson {
    return {
      ...super.json(),
      state: this.state,
      blinking: this.blinking,
      name: this.name,
      saying: this.saying,
    };
  }

  /**
   * {@link Player.tick} is called every frame to update player state.
   */
  public tick() {
    super.tick();

    this.landingElapsedMS += App.TICK_INTERVAL_MS;
    this.punchElapsedMS += App.TICK_INTERVAL_MS;

    // landing motion
    if (this.state === PlayerState.Landing) {
      if (this.landingElapsedMS < Player.LANDING_DURATION) {
        return;
      } else {
        this.state = PlayerState.Idle;
      }
    }

    // punching motion
    if (this.state === PlayerState.Punch) {
      if (this.punchElapsedMS < Player.PUNCH_DURATION) {
        return;
      } else {
        this.state = PlayerState.Idle;
      }
    }

    // hurt motion
    if (this.state === PlayerState.Hurt) {
      // in the air or just get hurt
      if (!this.onGround || this.vy < 0) {
        return;
      } else if (this.onGround) {
        this.state = PlayerState.Idle;
      }
    }

    if (this.onGround) {
      if ([PlayerState.Jumping, PlayerState.Falling].includes(this.state)) {
        this.state = PlayerState.Landing;
        this.landingElapsedMS = 0;
      }
    } else {
      if (this.vy > 0) {
        this.state = PlayerState.Falling;
      }
    }
  }

  /**
   * Update player properties based on user input. {@link Player.input} is triggered
   * at most once per tick.
   *
   * @param input The user keystroke data
   */
  public input(input: PlayerInput) {
    if (this.state === PlayerState.Punch || this.state === PlayerState.Hurt) {
      return;
    }

    if (input.a.isDown) {
      this.vx = -Player.MOVE_SPEED;
      this.flipped = true;
    } else if (input.d.isDown) {
      this.vx = Player.MOVE_SPEED;
      this.flipped = false;
    } else {
      this.vx = 0;
    }

    if (this.onGround && this.state !== PlayerState.Landing) {
      if (input.j.isPressed) {
        this.state = PlayerState.Punch;
        this.punchElapsedMS = 0;
        this.vx = 0;
      } else if (input.w.isDown) {
        this.state = PlayerState.Jumping;
        this.vy = -Player.JUMP_SPEED;
      } else if (input.a.isDown || input.d.isDown) {
        this.state = PlayerState.Run;
      } else {
        this.state = PlayerState.Idle;
      }
    }
  }

  /**
   * Get injured by a given enemy.
   *
   * @param enemy The enemy to receive damage from
   */
  public hurt(enemy: Enemy) {
    if (this.blinking) {
      return;
    }

    this.state = PlayerState.Hurt;
    this.vy = -Player.HURT_IMPACT_Y;

    const enemyOnRight = this.center.x < enemy.center.x;
    this.vx = (enemyOnRight ? -1 : 1) * Player.HURT_IMPACT_X;

    this.blink();
  }

  private blink() {
    this.blinking = true;
    setTimeout(() => {
      this.blinking = false;
    }, Player.BLINK_DURATION);
  }

  public say(text: string) {
    if (this.sayingTimeout) {
      clearTimeout(this.sayingTimeout);
      this.sayingTimeout = null;
    }

    this.saying = text;
    this.sayingTimeout = setTimeout(() => {
      this.saying = "";
    }, Player.SAYING_DURATION);
  }
}

export default Player;
