import Sprite, { BodyType } from "./Sprite";

class Gravity {
  // how fast objects fall in pixels per frame
  public static readonly G = 0.1;

  public static shared = new Gravity();

  private constructor() {}

  public tick(deltaMs: number, sprites: Sprite[]) {
    sprites
      .filter((s) => s.bodyType === BodyType.Dynamic)
      .forEach((s) => {
        s.vy += Gravity.G * deltaMs;
        s.x += s.vx * deltaMs;
        s.y += s.vy * deltaMs;
      });
  }
}

export default Gravity;
