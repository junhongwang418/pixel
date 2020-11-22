import Sprite from "./Sprite";
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

test("separate does nothing to non overlapping sprites", () => {
  const s1 = createSprite(0, 0, 16, 16);
  const s2 = createSprite(16, 0, 16, 16);
  expect(s1.x).toBe(0);
  expect(s1.y).toBe(0);
  expect(s2.x).toBe(16);
  expect(s2.y).toBe(0);
});

test("separate two sprites in x axis when y overlap is larger", () => {
  const s1 = createSprite(0, 0, 16, 16);
  const s2 = createSprite(15, 0, 16, 16);
  Collision.shared.separate(s1, s2);
  expect(s1.x).toBe(-1);
  expect(s1.y).toBe(0);
  expect(s2.x).toBe(15);
  expect(s2.y).toBe(0);
});

test("separate two sprites in y axis when x overlap is larger", () => {
  const s1 = createSprite(0, 0, 16, 16);
  const s2 = createSprite(0, 15, 16, 16);
  Collision.shared.separate(s1, s2);
  expect(s1.x).toBe(0);
  expect(s1.y).toBe(-1);
  expect(s2.x).toBe(0);
  expect(s2.y).toBe(15);
});

function createSprite(x: number, y: number, width: number, height: number) {
  const sprite = new Sprite({});
  sprite.position.set(x, y);
  sprite.width = width;
  sprite.height = height;
  return sprite;
}
