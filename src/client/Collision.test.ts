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

/**
 * Create a sprite for unit testing.
 *
 * @param x The x position of the sprite from top left corner
 * @param y The y posision of the sprite from top left corner
 * @param width The width of the sprite from top left corner
 * @param height The height of the sprite from top left corner
 * @return The sprite initialized with given arguments
 */
function createSprite(x: number, y: number, width: number, height: number) {
  // empty texture
  const sprite = new Sprite([]);
  sprite.position.set(x, y);
  sprite.width = width;
  sprite.height = height;
  return sprite;
}
