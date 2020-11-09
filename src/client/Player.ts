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
  private _state = PlayerState.IDLE;

  public constructor() {
    super({
      idle0: PIXI.Loader.shared.resources["assets/mrman/idle_0.png"].texture,
      idle1: PIXI.Loader.shared.resources["assets/mrman/idle_1.png"].texture,
      idle2: PIXI.Loader.shared.resources["assets/mrman/idle_2.png"].texture,
      idle3: PIXI.Loader.shared.resources["assets/mrman/idle_3.png"].texture,
      run0: PIXI.Loader.shared.resources["assets/mrman/run_0.png"].texture,
      run1: PIXI.Loader.shared.resources["assets/mrman/run_1.png"].texture,
      run2: PIXI.Loader.shared.resources["assets/mrman/run_2.png"].texture,
      run3: PIXI.Loader.shared.resources["assets/mrman/run_3.png"].texture,
      run4: PIXI.Loader.shared.resources["assets/mrman/run_4.png"].texture,
      run5: PIXI.Loader.shared.resources["assets/mrman/run_5.png"].texture,
    });

    this.textures = this.getIdleTextures();
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
      this.flipped = true;
    } else if (keyD.isDown) {
      this.vx = 1;
      this.flipped = false;
    } else {
      this.vx = 0;
    }

    if (keyA.isDown || keyD.isDown) {
      this.setState(PlayerState.RUN);
    } else {
      this.setState(PlayerState.IDLE);
    }
  }

  /**
   * Apply all the properties specified in the json.
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

  public setState(state: PlayerState) {
    if (this._state === state) return;

    if (state === PlayerState.IDLE) {
      this.textures = this.getIdleTextures();
      this._state = state;
      this.play();
    } else if (state === PlayerState.RUN) {
      this.textures = this.getRunTextures();
      this._state = state;
      this.play();
    } else {
      console.error(`Illegal player state ${state}`);
    }
  }

  /**
   * Get textures for idle state.
   */
  private getIdleTextures(): PIXI.Texture[] {
    return [
      this.textureMap["idle0"],
      this.textureMap["idle1"],
      this.textureMap["idle2"],
      this.textureMap["idle3"],
    ];
  }

  /**
   * Get textures for run state.
   */
  private getRunTextures(): PIXI.Texture[] {
    return [
      this.textureMap["run0"],
      this.textureMap["run1"],
      this.textureMap["run2"],
      this.textureMap["run3"],
      this.textureMap["run4"],
      this.textureMap["run5"],
    ];
  }
}

export default Player;
