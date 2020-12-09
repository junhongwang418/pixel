import { Howl } from "howler";

/**
 * A singleton class that manages all wav files used in the game
 * similar to like {@link TextureManager}.
 */
class SoundManager {
  public static shared = new SoundManager();

  public footstep: Howl;
  public jump: Howl;
  public punch: Howl;
  public hurt: Howl;
  public background: Howl;

  private constructor() {}

  /**
   * {@link SoundManager.init} must be called before the game starts
   * to load all the sounds beforehand.
   */
  public init() {
    this.background = new Howl({
      src: ["assets/sound/background/1.wav"],
      volume: 0.1,
      loop: true,
    });

    this.footstep = new Howl({
      src: ["assets/sound/effect/footstep.wav"],
      loop: true,
      volume: 0.2,
    });

    this.jump = new Howl({
      src: ["assets/sound/effect/jump.wav"],
      loop: false,
      volume: 0.4,
    });

    this.punch = new Howl({
      src: ["assets/sound/effect/punch.wav"],
      loop: false,
      volume: 0.3,
    });

    this.hurt = new Howl({
      src: ["assets/sound/effect/hurt.wav"],
    });
  }
}

export default SoundManager;
