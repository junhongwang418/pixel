import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";

/**
 * An enum that represents player state.
 */
enum State {
  IDLE,
  RUN,
}

/**
 * The sprite the user can control.
 */
class Player extends Sprite {
  private _state = State.IDLE;

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

    if (keyA.isDown || keyD.isDown) {
      this.setState(State.RUN);
    } else {
      this.setState(State.IDLE);
    }
  }

  public get state(): State {
    return this._state;
  }

  public setState(state: State) {
    if (this._state === state) return;

    if (state === State.IDLE) {
      this._state = state;
      this.textures = this.getIdleTextures();
      this.play();
    } else if (state === State.RUN) {
      this._state = state;
      this.textures = this.getRunTextures();
      this.play();
    } else {
      console.error("illegal state");
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
