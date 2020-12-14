import * as PIXI from "pixi.js";
import Sprite from "./Sprite";
import Keyboard from "./Keyboard";
import Effect from "./Effect";
import Enemy from "./Enemy";
import TextureManager from "./TextureManager";
import SoundManager from "./SoundManager";
import { PlayerJson, PlayerState } from "../server/Player";
import Text from "./Text";
import Scene from "./Scene";
import SceneManager from "./SceneManager";

class NameTag extends PIXI.Container {
  public box: PIXI.Graphics;
  private nameText: Text;

  constructor(name: string) {
    super();

    this.nameText = new Text(name, { fontSize: 16 });
    this.nameText.x = 4;
    this.nameText.y = 2;

    this.box = new PIXI.Graphics();
    this.box.beginFill(0x000000, 0.72);
    this.box.drawRect(0, 0, this.nameText.width + 8, this.nameText.height + 4);
    this.box.endFill();

    this.addChild(this.box);
    this.box.addChild(this.nameText);
  }

  public setName(name: string) {
    this.nameText.text = name;
    this.removeChild(this.box);
    this.box = new PIXI.Graphics();
    this.box.beginFill(0x000000, 0.72);
    this.box.drawRect(0, 0, this.nameText.width + 8, this.nameText.height + 4);
    this.box.endFill();
    this.addChild(this.box);
    this.box.addChild(this.nameText);
  }
}

/**
 * The sprite the user can control.
 */
class Player extends Sprite {
  private static readonly LANDING_DURATION = 100;
  private static readonly JUMP_SPEED = 600;
  private static readonly MOVE_SPEED = 120;
  private static readonly PUNCH_DURATION = 200;
  private static readonly BLINK_DURATION = 2000;
  private static readonly BLINK_INTERVAL = 60;
  private static readonly HURT_IMPACT_X = 30;
  private static readonly HURT_IMPACT_Y = 100;

  private state: PlayerState;
  private punchEffect: Effect;
  private landingElapsedMS: number;
  private punchElapsedMS: number;
  private blinkInterval: NodeJS.Timeout | null;
  private nameTag: NameTag;
  private username: string;

  public constructor(username: string) {
    super(Player.getTextures(PlayerState.Idle));
    this.setState(PlayerState.Idle);
    this.landingElapsedMS = 0;
    this.punchElapsedMS = 0;
    this.blinkInterval = null;
    this.username = username;

    // position relative to player
    this.punchEffect = new Effect(48, -8);

    this.nameTag = new NameTag(username);
    this.nameTag.x = this.width / 2 - this.nameTag.width / 2;
    this.nameTag.y = this.height + 4;

    this.addChild(this.nameTag);
  }

  /**
   * Update state for current frame.
   */
  public tick = () => {
    super.tick();

    // this.nameTag.y = this.height / this.scale.y;

    this.landingElapsedMS += PIXI.Ticker.shared.elapsedMS;
    this.punchElapsedMS += PIXI.Ticker.shared.elapsedMS;

    if (this.state === PlayerState.Hurt) {
      // in the air or just gets hurt
      if (!this.onGround || this.vy < 0) {
        return;
      }
    }

    // landing motion
    if (
      this.state === PlayerState.Landing &&
      this.landingElapsedMS < Player.LANDING_DURATION
    ) {
      return;
    }

    // punching motion
    if (
      this.state === PlayerState.Punch &&
      this.punchElapsedMS < Player.PUNCH_DURATION
    ) {
      return;
    }

    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    // update velocity
    if (keyA.isDown) {
      this.vx = -Player.MOVE_SPEED;
      this.setFlipped(true);
    } else if (keyD.isDown) {
      this.vx = Player.MOVE_SPEED;
      this.setFlipped(false);
    } else {
      this.vx = 0;
    }

    // update state
    if (this.onGround) {
      if ([PlayerState.Jumping, PlayerState.Falling].includes(this.state)) {
        this.setState(PlayerState.Landing);
      } else if (keyJ.isDown) {
        this.setState(PlayerState.Punch);
      } else if (keyW.isDown) {
        this.setState(PlayerState.Jumping);
      } else if (keyA.isDown || keyD.isDown) {
        this.setState(PlayerState.Run);
      } else {
        this.setState(PlayerState.Idle);
      }
    } else {
      if (this.vy > 0) {
        this.setState(PlayerState.Falling);
      }
    }
  };

  /**
   * Apply all the properties specified in the json.
   *
   * @param json Properties to apply
   */
  public applyJson(json: PlayerJson): void {
    super.applyJson(json);
    const { state, blinking, name } = json;
    this.setState(state);
    if (!this.blinking && blinking) {
      this.blink();
    }
    this.username = name;
    this.nameTag.setName(name);
    this.nameTag.x = this.width / 2 - this.nameTag.width / 2;
    this.nameTag.y = this.height + 4;
  }

  /**
   * Construct a player object based on the json.
   *
   * @param json Properties to initialize the player
   */
  public static fromJson(json: PlayerJson): Player {
    const player = new Player("");
    player.applyJson(json);
    return player;
  }

  /**
   * Get a json representing current state of the player.
   */
  public json(): PlayerJson {
    return {
      ...super.json(),
      state: this.state,
      blinking: this.blinking,
      name: this.username,
    };
  }

  /**
   * Update the player properties based on the new state.
   *
   * @param state The new player state
   */
  public setState(state: PlayerState) {
    if (this.state === state) return;

    this.state = state;
    this.setTextures(Player.getTextures(state));

    if (state === PlayerState.Punch) {
      this.addChild(this.punchEffect);
    } else {
      this.removeChild(this.punchEffect);
    }

    if (state === PlayerState.Run) {
      SoundManager.shared.footstep.play();
    } else {
      SoundManager.shared.footstep.stop();
    }

    if (state === PlayerState.Landing) {
      this.landingElapsedMS = 0;
    } else if (state === PlayerState.Punch) {
      this.vx = 0;
      SoundManager.shared.punch.play();
      this.punchElapsedMS = 0;
    } else if (state === PlayerState.Jumping) {
      this.vy = -Player.JUMP_SPEED;
      SoundManager.shared.jump.play();
    }
  }

  /**
   * Receives damage from enemy and gets knocked back.
   *
   * @param enemy The enemy to receive the damage from
   * @param direction The knockback direction. `1` is right. `-1` is left.
   */
  public hurt(enemy: Enemy, direction: 1 | -1) {
    if (this.blinking) {
      return;
    }

    this.setState(PlayerState.Hurt);
    this.vy = -Player.HURT_IMPACT_Y;
    this.vx = direction * Player.HURT_IMPACT_X;
    this.blink();
    SoundManager.shared.hurt.play();
  }

  /**
   * Get an appropriate set of textures for a given state.
   *
   * @param state The player state associated with the textures
   */
  private static getTextures(state: PlayerState) {
    switch (state) {
      case PlayerState.Idle:
        return TextureManager.shared.getMrManIdleTextures();
      case PlayerState.Run:
        return TextureManager.shared.getMrManRunTextures();
      case PlayerState.Jumping:
        return TextureManager.shared.getMrManJumpingTextures();
      case PlayerState.Falling:
        return TextureManager.shared.getMrManFallingTextures();
      case PlayerState.Landing:
        return TextureManager.shared.getMrManFallingTouchGroundTextures();
      case PlayerState.Punch:
        return TextureManager.shared.getMrManPunchTextures();
      case PlayerState.Hurt:
        return TextureManager.shared.getMrManHurtTextures();
      default:
        return [];
    }
  }

  /**
   * Flicker the sprite for a while. Flash the player when it receives
   * a damage to indicate that the player is invincible for a certain
   * period.
   */
  private blink() {
    // already blinking
    if (this.blinkInterval) {
      return;
    }

    this.blinkInterval = setInterval(() => {
      this.alpha = this.alpha ? 0 : 1;
    }, Player.BLINK_INTERVAL);

    setTimeout(() => {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
      this.alpha = 1;
    }, Player.BLINK_DURATION);
  }

  public get blinking() {
    return this.blinkInterval != null;
  }

  protected setFlipped(flipped: boolean) {
    if (this.flipped === flipped) return;

    this.nameTag.scale.x *= -1;
    this.nameTag.position.x = this.width / 2 - this.nameTag.width / 2;

    super.setFlipped(flipped);
  }
}

export default Player;
