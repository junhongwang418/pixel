import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";
import Effect from "./Effect";
import Enemy from "./Enemy";
import TextureManager from "./TextureManager";
import SoundManager from "./SoundManager";
import { PlayerJson, PlayerState } from "../server/Player";

/**
 * The sprite the user can control.
 */
class Player extends Sprite {
  private static readonly LANDING_DURATION = 100;
  private static readonly JUMP_SPEED = 240;
  private static readonly MOVE_SPEED = 60;
  private static readonly PUNCH_DURATION = 200;
  private static readonly BLINK_DURATION = 2000;
  private static readonly BLINK_INTERVAL = 60;
  private static readonly HURT_IMPACT_X = 30;
  private static readonly HURT_IMPACT_Y = 100;

  private state: PlayerState;

  private landingElapsedMS: number;
  private punchElapsedMS: number;

  private punchEffect: Effect;

  private blinkInterval: NodeJS.Timeout | null;

  public constructor() {
    super(Player.getTextures(PlayerState.Idle));
    this.setState(PlayerState.Idle);
    this.landingElapsedMS = 0;
    this.punchElapsedMS = 0;
    // position relative to player
    this.punchEffect = new Effect(16, -8);
    this.blinkInterval = null;
  }

  /**
   * Update state for current frame.
   */
  public tick(): void {
    super.tick();

    this.landingElapsedMS += PIXI.Ticker.shared.elapsedMS;
    this.punchElapsedMS += PIXI.Ticker.shared.elapsedMS;

    if (this.state === PlayerState.Hurt) {
      // in the air or just gets hurt
      if (!this.onGround || this.vy < 0) {
        return;
      }
    }

    // landing motion
    if (
      this.state === PlayerState.Landing &&
      this.landingElapsedMS < Player.LANDING_DURATION
    ) {
      return;
    }

    // punching motion
    if (
      this.state === PlayerState.Punch &&
      this.punchElapsedMS < Player.PUNCH_DURATION
    ) {
      return;
    }

    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    // update velocity
    if (keyA.isDown) {
      this.vx = -Player.MOVE_SPEED;
      this.setFlipped(true);
    } else if (keyD.isDown) {
      this.vx = Player.MOVE_SPEED;
      this.setFlipped(false);
    } else {
      this.vx = 0;
    }

    // update state
    if (this.onGround) {
      if ([PlayerState.Jumping, PlayerState.Falling].includes(this.state)) {
        this.setState(PlayerState.Landing);
      } else if (keyJ.isDown) {
        this.setState(PlayerState.Punch);
      } else if (keyW.isDown) {
        this.setState(PlayerState.Jumping);
      } else if (keyA.isDown || keyD.isDown) {
        this.setState(PlayerState.Run);
      } else {
        this.setState(PlayerState.Idle);
      }
    } else {
      if (this.vy > 0) {
        this.setState(PlayerState.Falling);
      }
    }
  }

  /**
   * Apply all the properties specified in the json.
   *
   * @param {PlayerJson} json Properties to apply
   */
  public applyJson(json: PlayerJson): void {
    const {
      x,
      y,
      width,
      height,
      vx,
      vy,
      state,
      scaleX,
      onGround,
      blinking,
    } = json;
    this.position.set(x, y);
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.scale.x = scaleX;
    this.setState(state);
    this.onGround = onGround;

    if (!this.blinking && blinking) {
      this.blink();
    }
  }

  /**
   * Construct a player object based on the json.
   *
   * @param json Properties to initialize the player
   */
  public static fromJson(json: PlayerJson): Player {
    const player = new Player();
    player.applyJson(json);
    return player;
  }

  /**
   * Get a json representing current state of the player.
   */
  public get json(): PlayerJson {
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
      blinking: this.blinking,
    };
  }

  /**
   * Update the player properties based on the new state.
   *
   * @param state The new player state
   */
  public setState(state: PlayerState) {
    if (this.state === state) return;

    this.state = state;
    this.setTextures(Player.getTextures(state));

    if (state === PlayerState.Punch) {
      this.addChild(this.punchEffect);
    } else {
      this.removeChild(this.punchEffect);
    }

    if (state === PlayerState.Run) {
      SoundManager.shared.footstep.play();
    } else {
      SoundManager.shared.footstep.stop();
    }

    if (state === PlayerState.Landing) {
      this.landingElapsedMS = 0;
    } else if (state === PlayerState.Punch) {
      this.vx = 0;
      SoundManager.shared.punch.play();
      this.punchElapsedMS = 0;
    } else if (state === PlayerState.Jumping) {
      this.vy = -Player.JUMP_SPEED;
      SoundManager.shared.jump.play();
    }
  }

  /**
   * Receives damage from enemy and gets knocked back.
   *
   * @param enemy The enemy to receive the damage from
   * @param direction The knockback direction. `1` is right. `-1` is left.
   */
  public hurt(enemy: Enemy, direction: 1 | -1) {
    if (this.blinking) {
      return;
    }

    this.setState(PlayerState.Hurt);
    this.vy = -Player.HURT_IMPACT_Y;
    this.vx = direction * Player.HURT_IMPACT_X;
    this.blink();
    SoundManager.shared.hurt.play();
  }

  /**
   * Get an appropriate set of textures for a given state.
   *
   * @param state The player state associated with the textures
   */
  private static getTextures(state: PlayerState) {
    switch (state) {
      case PlayerState.Idle:
        return TextureManager.shared.getMrManIdleTextures();
      case PlayerState.Run:
        return TextureManager.shared.getMrManRunTextures();
      case PlayerState.Jumping:
        return TextureManager.shared.getMrManJumpingTextures();
      case PlayerState.Falling:
        return TextureManager.shared.getMrManFallingTextures();
      case PlayerState.Landing:
        return TextureManager.shared.getMrManFallingTouchGroundTextures();
      case PlayerState.Punch:
        return TextureManager.shared.getMrManPunchTextures();
      case PlayerState.Hurt:
        return TextureManager.shared.getMrManHurtTextures();
      default:
        return [];
    }
  }

  /**
   * Flicker the sprite for a while. Flash the player when it receives
   * a damage to indicate that the player is invincible for a certain
   * period.
   */
  private blink() {
    // already blinking
    if (this.blinkInterval) {
      return;
    }

    this.blinkInterval = setInterval(() => {
      this.alpha = this.alpha ? 0 : 1;
    }, Player.BLINK_INTERVAL);

    setTimeout(() => {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
      this.alpha = 1;
    }, Player.BLINK_DURATION);
  }

  public get blinking() {
    return this.blinkInterval != null;
  }
}

export default Player;
