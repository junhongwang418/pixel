import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
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
  private _state: PlayerState;
  private _flipped: boolean = false;

  public count = 0;

  public constructor() {
    super({
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
    });
    this.setState(PlayerState.IDLE);
    this.play();
  }

  /**
   * Update state for current frame.
   *
   * @param deltaMs Time it took to reach current frame from previous frame in milliseconds
   */
  public tick(): void {
    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");

    if (this._state === PlayerState.JUMPING && this.touchingBottom) {
      this.setState(PlayerState.FALLING_TOUCH_GROUND);
    }

    if (
      this.touchingBottom &&
      keyW.isDown &&
      ![
        PlayerState.JUMPING,
        PlayerState.FALLING,
        PlayerState.FALLING_TOUCH_GROUND,
      ].includes(this._state)
    ) {
      this.setState(PlayerState.JUMPING);
      this.vy = -2;
    }

    if (!this.touchingBottom && this.vy > 0) {
      this.setState(PlayerState.FALLING);
    }

    if (this._state === PlayerState.FALLING && this.touchingBottom) {
      this.setState(PlayerState.FALLING_TOUCH_GROUND);
    }

    if (this._state === PlayerState.FALLING_TOUCH_GROUND) {
      this.count++;
      if (this.count > 8) {
        this.count %= 8;
        this.setState(PlayerState.IDLE);
      }
    }

    if (keyA.isDown) {
      this.vx = -1;
      this.setFlipped(true);
      if (
        ![
          PlayerState.JUMPING,
          PlayerState.FALLING,
          PlayerState.FALLING_TOUCH_GROUND,
        ].includes(this._state)
      ) {
        this.setState(PlayerState.RUN);
      }
    } else if (keyD.isDown) {
      this.vx = 1;
      this.setFlipped(false);
      if (
        ![
          PlayerState.JUMPING,
          PlayerState.FALLING,
          PlayerState.FALLING_TOUCH_GROUND,
        ].includes(this._state)
      ) {
        this.setState(PlayerState.RUN);
      }
    } else {
      this.vx = 0;
      if (
        ![
          PlayerState.JUMPING,
          PlayerState.FALLING,
          PlayerState.FALLING_TOUCH_GROUND,
        ].includes(this._state)
      ) {
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

  public get state(): PlayerState {
    return this._state;
  }

  /**
   * Update the active textures based on the new player state.
   *
   * @param state The new player state
   */
  public setState(state: PlayerState) {
    if (this._state === state) return;

    if (state === PlayerState.IDLE) {
      this.setTextures(this.texturesMap["idle"]);
    } else if (state === PlayerState.RUN) {
      this.setTextures(this.texturesMap["run"]);
    } else if (state === PlayerState.JUMPING) {
      this.setTextures(this.texturesMap["jumping"]);
    } else if (state === PlayerState.FALLING) {
      this.setTextures(this.texturesMap["falling"]);
    } else if (state === PlayerState.FALLING_TOUCH_GROUND) {
      this.setTextures(this.texturesMap["falling_touch_ground"]);
    } else {
      console.error(`Illegal player state ${state}`);
      return;
    }

    this._state = state;
  }

  /**
   * Update the scale and position of the sprite to flip the texture horizontally.
   *
   * @param flipped Whether the sprite should be flipped or not
   */
  private setFlipped(flipped: boolean) {
    if (this._flipped === flipped) return;

    this.scale.x *= -1;
    this.position.x -= this.scale.x * this.width;

    this._flipped = flipped;
  }
}

export default Player;
