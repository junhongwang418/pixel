import * as PIXI from "pixi.js";

/**
 * A singleton class that manages all the textures used in the game.
 * {@link TextureManager.init} must be called before the game starts
 * to load all the textures into GPU.
 */
class TextureManager {
  public static shared = new TextureManager();

  private constructor() {}

  public init() {
    const loader = PIXI.Loader.shared;
    loader.add(this.getMrManIdleTextureFilePaths());
    loader.add(this.getMrManRunTextureFilePaths());
    loader.add(this.getMrManJumpingTextureFilePaths());
    loader.add(this.getMrManFallingTextureFilePaths());
    loader.add(this.getMrManFallingTouchGroundTextureFilePaths());
    loader.add(this.getMrManPunchTextureFilePaths());
    loader.add(this.getMrManHurtTextureFilePaths());
    loader.add(this.getTileTextureFilePaths());
    loader.add(this.getGrasslandTextureFilePaths());
    loader.add(this.getPunchEffectTextureFilePaths());
    loader.add(this.getBubIdleTextureFilePaths());
    loader.add(this.getBubRunTextureFilePaths());
  }

  public getMrManIdleTextures() {
    return this.getTextures(this.getMrManIdleTextureFilePaths());
  }

  public getMrManRunTextures() {
    return this.getTextures(this.getMrManRunTextureFilePaths());
  }

  public getMrManJumpingTextures() {
    return this.getTextures(this.getMrManJumpingTextureFilePaths());
  }

  public getMrManFallingTextures() {
    return this.getTextures(this.getMrManFallingTextureFilePaths());
  }

  public getMrManFallingTouchGroundTextures() {
    return this.getTextures(this.getMrManFallingTouchGroundTextureFilePaths());
  }

  public getMrManPunchTextures() {
    return this.getTextures(this.getMrManPunchTextureFilePaths());
  }

  public getMrManHurtTextures() {
    return this.getTextures(this.getMrManHurtTextureFilePaths());
  }

  public getTileTextures() {
    return this.getTextures(this.getTileTextureFilePaths());
  }

  public getGrasslandTextures() {
    return this.getTextures(this.getGrasslandTextureFilePaths());
  }

  public getPunchEffectTextures() {
    return this.getTextures(this.getPunchEffectTextureFilePaths());
  }

  public getBubIdleTextures() {
    return this.getTextures(this.getBubIdleTextureFilePaths());
  }

  public getBubRunTextures() {
    return this.getTextures(this.getBubRunTextureFilePaths());
  }

  private getTextures(filePaths: string[]) {
    return filePaths.map((filePath) => this.getTexture(filePath));
  }

  private getTexture(filePath: string) {
    return PIXI.Loader.shared.resources[filePath].texture;
  }

  private getMrManIdleTextureFilePaths() {
    return [
      "assets/sprites/mrman/idle_0.png",
      "assets/sprites/mrman/idle_1.png",
      "assets/sprites/mrman/idle_2.png",
      "assets/sprites/mrman/idle_3.png",
    ];
  }

  private getMrManRunTextureFilePaths() {
    return [
      "assets/sprites/mrman/run_0.png",
      "assets/sprites/mrman/run_1.png",
      "assets/sprites/mrman/run_2.png",
      "assets/sprites/mrman/run_3.png",
      "assets/sprites/mrman/run_4.png",
      "assets/sprites/mrman/run_5.png",
    ];
  }

  private getMrManJumpingTextureFilePaths() {
    return ["assets/sprites/mrman/jumping.png"];
  }

  private getMrManFallingTextureFilePaths() {
    return ["assets/sprites/mrman/falling.png"];
  }

  private getMrManFallingTouchGroundTextureFilePaths() {
    return ["assets/sprites/mrman/falling_touch_ground.png"];
  }

  private getMrManPunchTextureFilePaths() {
    return [
      "assets/sprites/mrman/punch_0.png",
      "assets/sprites/mrman/punch_1.png",
      "assets/sprites/mrman/punch_2.png",
    ];
  }

  private getMrManHurtTextureFilePaths() {
    return ["assets/sprites/mrman/hurt.png"];
  }

  private getTileTextureFilePaths() {
    return [
      "assets/tiles/tile_1.png",
      "assets/tiles/tile_2.png",
      "assets/tiles/tile_3.png",
      "assets/tiles/tile_4.png",
    ];
  }

  private getGrasslandTextureFilePaths() {
    return [
      "assets/backgrounds/grassland/0.png",
      "assets/backgrounds/grassland/1.png",
      "assets/backgrounds/grassland/2.png",
      "assets/backgrounds/grassland/3.png",
      "assets/backgrounds/grassland/4.png",
    ];
  }

  private getPunchEffectTextureFilePaths() {
    return [
      "assets/effects/punch/0.png",
      "assets/effects/punch/1.png",
      "assets/effects/punch/2.png",
    ];
  }

  private getBubIdleTextureFilePaths() {
    return ["assets/sprites/bub/idle_0.png", "assets/sprites/bub/idle_1.png"];
  }

  private getBubRunTextureFilePaths() {
    return [
      "assets/sprites/bub/run_0.png",
      "assets/sprites/bub/run_1.png",
      "assets/sprites/bub/run_2.png",
      "assets/sprites/bub/run_3.png",
      "assets/sprites/bub/run_4.png",
      "assets/sprites/bub/run_5.png",
    ];
  }
}

export default TextureManager;
