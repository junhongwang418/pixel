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
  saying: string;
}

class Player extends Sprite {
  public name: string;
  public state = PlayerState.Idle;
  public blinking = false;
  public saying = "";

  constructor(name: string, x: number, y: number) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
  }

  public applyJson(json: PlayerJson) {
    super.applyJson(json);
    const { state, blinking, name, saying } = json;
    this.state = state;
    this.blinking = blinking;
    this.name = name;
    this.saying = saying;
  }

  public json(): PlayerJson {
    return {
      ...super.json(),
      state: this.state,
      blinking: this.blinking,
      name: this.name,
      saying: this.saying,
    };
  }
}

export default Player;
