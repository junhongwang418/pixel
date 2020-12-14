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
  name: string;
  state: PlayerState;
  blinking: boolean;
}

class Player extends Sprite {
  public name = "";
  public state = PlayerState.Idle;
  public blinking = false;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  public applyJson(json: PlayerJson) {
    super.applyJson(json);
    const { state, blinking, name } = json;
    this.state = state;
    this.blinking = blinking;
    this.name = name;
  }

  public json(): PlayerJson {
    return {
      ...super.json(),
      state: this.state,
      blinking: this.blinking,
      name: this.name,
    };
  }
}

export default Player;
