import * as PIXI from "pixi.js";
import Player from "./Player";
import SceneManager from "./SceneManager";
import TextureManager from "./TextureManager";

/**
 * {@link PIXI.Container} with Parallax scrolling support.
 */
class Background extends PIXI.Container {
  public sourceTextureWidth: number;
  public sourceTextureHeight: number;
  public tilingSprites: PIXI.TilingSprite[];

  /**
   * Create a {@link PIXI.Container} with tiling sprites as children.
   * Assume all the background textures ordered such that the index
   * represents the depth. Deeper texture is drawn earlier.
   *
   * @param width Width of the entire background
   */
  constructor(width: number) {
    super();

    const textures = TextureManager.shared.getGrasslandTextures();

    const texture = textures[0];
    this.sourceTextureWidth = texture.width;
    this.sourceTextureHeight = texture.height;

    this.tilingSprites = [];
    for (let i = 0; i < textures.length; i++) {
      this.tilingSprites.push(
        new PIXI.TilingSprite(textures[i], width, this.sourceTextureHeight)
      );
    }

    this.addChild(...this.tilingSprites.slice().reverse());
  }

  /**
   * Call this method every frame to make the background move
   * as the player moves. Background with higher depth moves
   * slower then background with lower depth. This creates an
   * illusion that the background with higher depth is further
   * away from the scene.
   *
   * @param player The sprite the background moves with respect to
   * @param viewportWidth Width of the screen
   */
  public tick(player: Player, viewportWidth: number) {
    // check if the player is near the left world boundary
    if (player.center.x > viewportWidth / 2) {
      this.tilingSprites
        .slice()
        .reverse()
        .forEach((ts, index) => {
          ts.tilePosition.x =
            -1 * (player.center.x - viewportWidth / 2) * index * index * 0.01;
        });
    } else {
      this.tilingSprites.forEach((s) => (s.tilePosition.x = 0));
    }
  }
}

export default Background;
