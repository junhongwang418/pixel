import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";

/**
 * An enum that represents player state.
 */
export enum PlayerState {
  IDLE,
  RUN,
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
 * @class
 *
 * @constructor
 */
class Player extends Sprite {
  private _state: PlayerState;
  private _flipped: boolean = false;

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
    });
    this.setState(PlayerState.IDLE);
    this.play();
  }

  /**
   * Update state for current frame.
   *
   * @param {number} deltaMs time it took to reach current frame from previous frame in milliseconds
   * @override
   */
  public tick(deltaMs: number): void {
    super.tick(deltaMs);

    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");

    if (keyA.isDown) {
      this.vx = -1;
      this.setFlipped(true);
      this.setState(PlayerState.RUN);
    } else if (keyD.isDown) {
      this.vx = 1;
      this.setFlipped(false);
      this.setState(PlayerState.RUN);
    } else {
      this.vx = 0;
      this.setState(PlayerState.IDLE);
    }
  }

  /**
   * Apply all the properties specified in the json.
   *
   * @param {PlayerJson} json properties to apply
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
   * @param {PlayerJson} json properties to initialize the player
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
   * @param {PlayerState} state the new player state
   */
  public setState(state: PlayerState) {
    if (this._state === state) return;

    if (state === PlayerState.IDLE) {
      this.setTextures(this.texturesMap["idle"]);
      this._state = state;
    } else if (state === PlayerState.RUN) {
      this.setTextures(this.texturesMap["run"]);
      this._state = state;
    } else {
      console.error(`Illegal player state ${state}`);
    }
  }

  /**
   * Update the scale and position of the sprite to flip the texture horizontally.
   *
   * @param {boolean} flipped whether the sprite should be flipped or not
   */
  private setFlipped(flipped: boolean) {
    if (this._flipped === flipped) return;

    this.scale.x *= -1;
    this.position.x -= this.scale.x * this.width;

    this._flipped = flipped;
  }
}

export default Player;
