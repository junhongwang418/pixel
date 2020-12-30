import { SpriteJson } from "./Sprite";

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

export interface PlayerInput {
  a: {
    isDown: boolean;
    isPressed: boolean;
  };
  d: {
    isDown: boolean;
    isPressed: boolean;
  };
  w: {
    isDown: boolean;
    isPressed: boolean;
  };
  j: {
    isDown: boolean;
    isPressed: boolean;
  };
}
