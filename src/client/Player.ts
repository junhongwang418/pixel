import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";
import { Howl } from "howler";
import Effect from "./Effect";

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
  private static readonly FALLING_TOUCH_GROUND_DELAY = 6;
  private static readonly JUMP_SPEED = 240;
  private static readonly MOVE_SPEED = 60;
  private static readonly PUNCH_DURATION = 300;

  private state: PlayerState;

  private currfallingTouchGroundDelay = 0;
  private currPunchDuration = 0;

  private footstepSound: Howl;
  private jumpSound: Howl;
  private punchSound: Howl;

  private punchEffect: Effect;

  public constructor() {
    super(Player.getTextures(PlayerState.IDLE));
    this.setState(PlayerState.IDLE);

    this.footstepSound = new Howl({
      src: ["assets/audio/effect/footstep.wav"],
      loop: true,
      volume: 0.2,
    });

    this.jumpSound = new Howl({
      src: ["assets/audio/effect/jump.wav"],
      loop: false,
      volume: 0.4,
    });

    this.punchSound = new Howl({
      src: ["assets/audio/effect/punch.wav"],
      loop: true,
      volume: 0.3,
    });

    this.punchEffect = new Effect();
    this.punchEffect.x = 16;
    this.punchEffect.y = -8;
  }

  /**
   * Update state for current frame.
   */
  public tick(): void {
    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    if (
      (this.state === PlayerState.JUMPING ||
        this.state === PlayerState.FALLING) &&
      this.onGround
    ) {
      this.setState(PlayerState.FALLING_TOUCH_GROUND);
    }

    if (!this.onGround && this.vy > 0) {
      this.setState(PlayerState.FALLING);
    }

    if (this.state === PlayerState.FALLING_TOUCH_GROUND) {
      this.currfallingTouchGroundDelay += PIXI.Ticker.shared.elapsedMS;
      if (
        this.currfallingTouchGroundDelay > Player.FALLING_TOUCH_GROUND_DELAY
      ) {
        this.currfallingTouchGroundDelay = 0;
        this.setState(PlayerState.IDLE);
      }
    }

    if (keyJ.isDown && this.canJump && this.state !== PlayerState.PUNCH) {
      this.setState(PlayerState.PUNCH);
      this.vx = 0;
      this.addChild(this.punchEffect);
      this.punchSound.play();
    }

    if (this.state === PlayerState.PUNCH) {
      this.currPunchDuration += PIXI.Ticker.shared.elapsedMS;
      if (this.currPunchDuration > Player.PUNCH_DURATION) {
        this.currPunchDuration = 0;
        this.setState(PlayerState.IDLE);
        this.removeChild(this.punchEffect);
        this.punchSound.stop();
      }
    } else {
      if (keyW.isDown && this.canJump) {
        this.setState(PlayerState.JUMPING);
        this.vy = -Player.JUMP_SPEED;
        this.jumpSound.play();
      }

      if (keyA.isDown) {
        this.vx = -Player.MOVE_SPEED;
        this.setFlipped(true);
        if (this.canJump) {
          this.setState(PlayerState.RUN);
        }
      } else if (keyD.isDown) {
        this.vx = Player.MOVE_SPEED;
        this.setFlipped(false);
        if (this.canJump) {
          this.setState(PlayerState.RUN);
        }
      } else {
        this.vx = 0;
        if (this.canJump) {
          this.setState(PlayerState.IDLE);
        }
      }
    }

    if (this.state === PlayerState.RUN) {
      if (!this.footstepSound.playing()) {
        this.footstepSound.play();
      }
    } else {
      this.footstepSound.stop();
    }

    this.x += (this.vx * PIXI.Ticker.shared.elapsedMS) / 1000;
    this.y += (this.vy * PIXI.Ticker.shared.elapsedMS) / 1000;
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
  }

  public get canJump(): boolean {
    const states = [
      PlayerState.JUMPING,
      PlayerState.FALLING,
      PlayerState.FALLING_TOUCH_GROUND,
    ];
    return !states.includes(this.state);
  }

  /**
   * Get an appropriate set of textures for a given state.
   *
   * @param state The player state associated with the textures
   */
  private static getTextures(state: PlayerState) {
    switch (state) {
      case PlayerState.IDLE:
        return [
          PIXI.Loader.shared.resources["assets/mrman/idle_0.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_1.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_2.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_3.png"].texture,
        ];
      case PlayerState.RUN:
        return [
          PIXI.Loader.shared.resources["assets/mrman/run_0.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_1.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_2.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_3.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_4.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_5.png"].texture,
        ];
      case PlayerState.JUMPING:
        return [
          PIXI.Loader.shared.resources["assets/mrman/jumping.png"].texture,
        ];
      case PlayerState.FALLING:
        return [
          PIXI.Loader.shared.resources["assets/mrman/falling.png"].texture,
        ];
      case PlayerState.FALLING_TOUCH_GROUND:
        return [
          PIXI.Loader.shared.resources["assets/mrman/falling_touch_ground.png"]
            .texture,
        ];
      case PlayerState.PUNCH:
        return [
          PIXI.Loader.shared.resources["assets/mrman/punch_0.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/punch_1.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/punch_2.png"].texture,
        ];
      default:
        return [];
    }
  }
}

export default Player;
