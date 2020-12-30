import * as PIXI from "pixi.js";

/**
 * A singleton class that manages all the images used in the game.
 * Use {@link TextureManager} to get a texture instead of
 * {@link PIXI.Loader} throughout the code base. This class decouples
 * the file paths from the game logic, so if you change an image
 * file path, this is the only place you need to update.
 */
class TextureManager {
  public static shared = new TextureManager();

  private constructor() {}

  /**
   * {@link TextureManager.init} must be called before the game starts
   * to load all the textures into the graphics card.
   */
  public init() {
    const loader = PIXI.Loader.shared;
    loader.add(this.getMrManIdleTextureFilePaths());
    loader.add(this.getMrManRunTextureFilePaths());
    loader.add(this.getMrManJumpingTextureFilePaths());
    loader.add(this.getMrManFallingTextureFilePaths());
    loader.add(this.getMrManLandingTextureFilePaths());
    loader.add(this.getMrManPunchTextureFilePaths());
    loader.add(this.getMrManHurtTextureFilePaths());
    loader.add(this.getGrasslandTileSpritesheetFilePath());
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
    return this.getTextures(this.getMrManLandingTextureFilePaths());
  }

  public getMrManPunchTextures() {
    return this.getTextures(this.getMrManPunchTextureFilePaths());
  }

  public getMrManHurtTextures() {
    return this.getTextures(this.getMrManHurtTextureFilePaths());
  }

  public getGrasslandTileSpritesheet() {
    return this.getTexture(this.getGrasslandTileSpritesheetFilePath());
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

  private getMrManLandingTextureFilePaths() {
    return ["assets/sprites/mrman/landing.png"];
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

  private getGrasslandTileSpritesheetFilePath() {
    return "assets/map/grassland/tiles.png";
  }

  private getGrasslandTextureFilePaths() {
    return [
      "assets/backgrounds/grassland/0.png",
      "assets/backgrounds/grassland/1.png",
      "assets/backgrounds/grassland/2.png",
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
