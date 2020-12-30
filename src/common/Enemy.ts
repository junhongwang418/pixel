import { SpriteJson } from "./Sprite";

export enum EnemyState {
  Idle,
  Run,
}

export interface EnemyJson extends SpriteJson {
  state: EnemyState;
}
