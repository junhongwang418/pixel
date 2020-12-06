import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";
import { Howl } from "howler";
import Effect from "./Effect";
import Enemy from "./Enemy";
import TextureManager from "./TextureManager";
import SoundManager from "./SoundManager";

/**
 * An enum that represents player state.
 */
export enum PlayerState {
  IDLE,
  RUN,
  JUMPING,
  FALLING,
  FALLING_TOUCH_GROUND,
  PUNCH,
  HURT,
}

/**
 * The json representation of the player data. The data is used to synchronize the players across all the client sockets.
 */
export interface PlayerJson {
  x: number;
  y: number;
  state: PlayerState;
  scaleX: number;
}

/**
 * The sprite the user can control.
 */
class Player extends Sprite {
  private static readonly LANDING_DURATION = 100;
  private static readonly JUMP_SPEED = 240;
  private static readonly MOVE_SPEED = 60;
  private static readonly PUNCH_DURATION = 300;
  private static readonly BLINK_DURATION = 2000;
  private static readonly BLINK_INTERVAL = 60;
  private static readonly HURT_IMPACT_X = 30;
  private static readonly HURT_IMPACT_Y = 100;

  private state: PlayerState;

  private landingElapsedMS = 0;
  private punchElapsedMS = 0;
  private blinkElapsedMS = 0;

  private punchEffect: Effect;

  private blinkInterval: NodeJS.Timeout;

  public constructor() {
    super(Player.getTextures(PlayerState.IDLE));
    this.setState(PlayerState.IDLE);

    this.punchEffect = new Effect();
    this.punchEffect.x = 16;
    this.punchEffect.y = -8;
  }

  /**
   * Update state for current frame.
   */
  public tick(): void {
    super.tick();

    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    if (
      (this.state === PlayerState.HURT && !this.onGround) ||
      (this.onGround && this.vy < 0)
    ) {
      return;
    }

    if (this.state === PlayerState.FALLING_TOUCH_GROUND) {
      this.landingElapsedMS += PIXI.Ticker.shared.elapsedMS;
      if (this.landingElapsedMS < Player.LANDING_DURATION) {
        return;
      }
      this.landingElapsedMS = 0;
    }

    if (this.state === PlayerState.PUNCH) {
      this.punchElapsedMS += PIXI.Ticker.shared.elapsedMS;
      if (this.punchElapsedMS < Player.PUNCH_DURATION) {
        return;
      }
      this.punchElapsedMS = 0;
      SoundManager.shared.punch.stop();
    }

    if (keyA.isDown) {
      this.vx = -Player.MOVE_SPEED;
      this.setFlipped(true);
    } else if (keyD.isDown) {
      this.vx = Player.MOVE_SPEED;
      this.setFlipped(false);
    } else {
      this.vx = 0;
    }

    if (this.onGround) {
      if ([PlayerState.JUMPING, PlayerState.FALLING].includes(this.state)) {
        this.setState(PlayerState.FALLING_TOUCH_GROUND);
      } else if (keyJ.isDown) {
        this.setState(PlayerState.PUNCH);
        this.vx = 0;
        SoundManager.shared.punch.play();
      } else if (keyW.isDown) {
        this.setState(PlayerState.JUMPING);
        this.vy = -Player.JUMP_SPEED;
        SoundManager.shared.jump.play();
      } else if (keyA.isDown || keyD.isDown) {
        this.setState(PlayerState.RUN);
      } else {
        this.setState(PlayerState.IDLE);
      }
    } else {
      if (this.vy > 0) {
        this.setState(PlayerState.FALLING);
      }
    }

    if (this.state === PlayerState.RUN) {
      if (!SoundManager.shared.footstep.playing()) {
        SoundManager.shared.footstep.play();
      }
    } else {
      SoundManager.shared.footstep.stop();
    }
  }

  /**
   * Apply all the properties specified in the json.
   *
   * @param {PlayerJson} json Properties to apply
   */
  public applyJson(json: PlayerJson): void {
    const { x, y, state, scaleX } = json;
    this.position.set(x, y);
    this.scale.x = scaleX;
    this.setState(state);
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
      state: this.state,
      scaleX: this.scale.x,
    };
  }

  /**
   * Update the active textures based on the new player state.
   *
   * @param state The new player state
   */
  public setState(state: PlayerState) {
    if (this.state === state) return;

    this.state = state;
    this.setTextures(Player.getTextures(state));

    if (state === PlayerState.PUNCH) {
      this.addChild(this.punchEffect);
    } else {
      this.removeChild(this.punchEffect);
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

    this.setState(PlayerState.HURT);
    this.vy = -Player.HURT_IMPACT_Y;
    this.vx = direction * Player.HURT_IMPACT_X;
    this.blink();
    SoundManager.shared.hurt.play();
    if (SoundManager.shared.punch.playing()) {
      SoundManager.shared.punch.stop();
    }
  }

  /**
   * Get an appropriate set of textures for a given state.
   *
   * @param state The player state associated with the textures
   */
  private static getTextures(state: PlayerState) {
    switch (state) {
      case PlayerState.IDLE:
        return TextureManager.shared.getMrManIdleTextures();
      case PlayerState.RUN:
        return TextureManager.shared.getMrManRunTextures();
      case PlayerState.JUMPING:
        return TextureManager.shared.getMrManJumpingTextures();
      case PlayerState.FALLING:
        return TextureManager.shared.getMrManFallingTextures();
      case PlayerState.FALLING_TOUCH_GROUND:
        return TextureManager.shared.getMrManFallingTouchGroundTextures();
      case PlayerState.PUNCH:
        return TextureManager.shared.getMrManPunchTextures();
      case PlayerState.HURT:
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
