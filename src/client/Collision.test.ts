import * as PIXI from "pixi.js";
import Collision from "./Collision";

test("overlap returns true when two sprites intersect", () => {
  const s1 = createSprite(0, 0, 16, 16);
  const s2 = createSprite(8, 8, 16, 16);
  expect(Collision.shared.overlap(s1, s2)).toBe(true);
});

test("overlap returns false when two sprites do not intersect", () => {
  const s1 = createSprite(0, 0, 16, 16);
  const s2 = createSprite(16, 0, 16, 16);
  expect(Collision.shared.overlap(s1, s2)).toBe(false);
});

function createSprite(x: number, y: number, width: number, height: number) {
  const sprite = new PIXI.Sprite();
  sprite.position.set(x, y);
  sprite.width = width;
  sprite.height = height;
  return sprite;
}
