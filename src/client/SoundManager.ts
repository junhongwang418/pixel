import { Howl } from "howler";

class SoundManager {
  public static shared = new SoundManager();

  public footstep: Howl;
  public jump: Howl;
  public punch: Howl;
  public hurt: Howl;

  private constructor() {
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
