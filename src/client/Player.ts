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
    super.tick();

    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    if (this.state === PlayerState.FALLING_TOUCH_GROUND) {
      this.currfallingTouchGroundDelay += PIXI.Ticker.shared.elapsedMS;
      if (
        this.currfallingTouchGroundDelay < Player.FALLING_TOUCH_GROUND_DELAY
      ) {
        return;
      }
      this.currfallingTouchGroundDelay = 0;
    }

    if (this.state === PlayerState.PUNCH) {
      this.currPunchDuration += PIXI.Ticker.shared.elapsedMS;
      if (this.currPunchDuration < Player.PUNCH_DURATION) {
        return;
      }
      this.currPunchDuration = 0;
      this.removeChild(this.punchEffect);
      this.punchSound.stop();
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
        this.addChild(this.punchEffect);
        this.punchSound.play();
      } else if (keyW.isDown) {
        this.setState(PlayerState.JUMPING);
        this.vy = -Player.JUMP_SPEED;
        this.jumpSound.play();
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
      if (!this.footstepSound.playing()) {
        this.footstepSound.play();
      }
    } else {
      this.footstepSound.stop();
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
