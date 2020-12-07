import Sprite, { SpriteJson } from "./Sprite";

/**
 * An enum that represents player state.
 */
export enum PlayerState {
  Idle,
  Run,
  Jumping,
  Falling,
  Landing,
  Punch,
  Hurt,
}

export interface PlayerJson extends SpriteJson {
  state: PlayerState;
  blinking: boolean;
}

class Player extends Sprite {
  public state = PlayerState.Idle;
  public blinking = false;

  public applyJson(json: PlayerJson) {
    super.applyJson(json);
    const { state, blinking } = json;
    this.state = state;
    this.blinking = blinking;
  }

  public json(): PlayerJson {
    return {
      ...super.json(),
      state: this.state,
      blinking: this.blinking,
    };
  }
}

export default Player;
