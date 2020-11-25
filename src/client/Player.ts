import * as PIXI from "pixi.js";
import Sprite, { BodyType } from "./Sprite";
import Keyboard from "./Keyboard";

/**
 * An enum that represents player state.
 */
export enum PlayerState {
  IDLE,
  RUN,
  JUMPING,
  FALLING,
  FALLING_TOUCH_GROUND,
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
  private static readonly JUMP_SPEED = 2;
  private static readonly MOVE_SPEED = 1;

  private state: PlayerState;
  private flipped: boolean = false;

  private currfallingTouchGroundDelay = 0;

  public constructor() {
    super(
      {
        idle: [
          PIXI.Loader.shared.resources["assets/mrman/idle_0.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_1.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_2.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/idle_3.png"].texture,
        ],
        run: [
          PIXI.Loader.shared.resources["assets/mrman/run_0.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_1.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_2.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_3.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_4.png"].texture,
          PIXI.Loader.shared.resources["assets/mrman/run_5.png"].texture,
        ],
        jumping: [
          PIXI.Loader.shared.resources["assets/mrman/jumping.png"].texture,
        ],
        falling: [
          PIXI.Loader.shared.resources["assets/mrman/falling.png"].texture,
        ],
        falling_touch_ground: [
          PIXI.Loader.shared.resources["assets/mrman/falling_touch_ground.png"]
            .texture,
        ],
      },
      BodyType.Dynamic
    );
    this.setState(PlayerState.IDLE);
  }

  /**
   * Update state for current frame.
   *
   * @param deltaMs Time it took to reach current frame from previous frame in milliseconds
   */
  public tick(deltaMs: number): void {
    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");

    if (
      (this.state === PlayerState.JUMPING ||
        this.state === PlayerState.FALLING) &&
      this.touchingBottom
    ) {
      this.setState(PlayerState.FALLING_TOUCH_GROUND);
    }

    if (!this.touchingBottom && this.vy > 0) {
      this.setState(PlayerState.FALLING);
    }

    if (this.state === PlayerState.FALLING_TOUCH_GROUND) {
      this.currfallingTouchGroundDelay += deltaMs;
      if (
        this.currfallingTouchGroundDelay > Player.FALLING_TOUCH_GROUND_DELAY
      ) {
        this.currfallingTouchGroundDelay = 0;
        this.setState(PlayerState.IDLE);
      }
    }

    if (keyW.isDown && this.canJump) {
      this.setState(PlayerState.JUMPING);
      this.vy = -Player.JUMP_SPEED;
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

    if (state === PlayerState.IDLE) {
      this.setCurrTextures(this.texturesMap["idle"]);
    } else if (state === PlayerState.RUN) {
      this.setCurrTextures(this.texturesMap["run"]);
    } else if (state === PlayerState.JUMPING) {
      this.setCurrTextures(this.texturesMap["jumping"]);
    } else if (state === PlayerState.FALLING) {
      this.setCurrTextures(this.texturesMap["falling"]);
    } else if (state === PlayerState.FALLING_TOUCH_GROUND) {
      this.setCurrTextures(this.texturesMap["falling_touch_ground"]);
    } else {
      console.error(`Illegal player state ${state}`);
      return;
    }

    this.state = state;
  }

  /**
   * Update the scale and position of the sprite to flip the texture horizontally.
   *
   * @param flipped Whether the sprite should be flipped or not
   */
  private setFlipped(flipped: boolean) {
    if (this.flipped === flipped) return;

    this.scale.x *= -1;
    this.position.x -= this.scale.x * this.width;

    this.flipped = flipped;
  }

  public get canJump(): boolean {
    const states = [
      PlayerState.JUMPING,
      PlayerState.FALLING,
      PlayerState.FALLING_TOUCH_GROUND,
    ];
    return !states.includes(this.state);
  }
}

export default Player;
