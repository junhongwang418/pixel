import Sprite from "./Sprite";
import Keyboard from "../input/Keyboard";
import Effect from "./Effect";
import TextureManager from "../manager/TextureManager";
import SoundManager from "../manager/SoundManager";
import {
  PlayerInput,
  PlayerJson,
  PlayerState,
} from "../../common/sprite/Player";
import Paragraph from "../ui/Paragraph";
import Color from "../Color";
import MessageBubble from "../ui/MessageBubble";

/**
 * The sprite the user can control.
 */
class Player extends Sprite {
  private static readonly BLINK_INTERVAL = 60;

  private state: PlayerState;

  private nameTag: Paragraph;
  private messageBubble: MessageBubble;

  private punchEffect: Effect;
  private blinkInterval: NodeJS.Timeout | null;

  public constructor() {
    super(Player.getTextures(PlayerState.Idle));
    this.setState(PlayerState.Idle);

    this.blinkInterval = null;
    this.messageBubble = new MessageBubble("", {
      borderWidth: 1,
      borderColor: Color.BLACK,
      color: Color.BLACK,
      paddingX: 8,
      paddingY: 4,
      backgroundColor: Color.WHITE,
      backgroundAlpha: 1,
    });

    // position relative to player
    this.punchEffect = new Effect(48, -8);

    this.nameTag = new Paragraph("", {
      color: Color.WHITE,
      paddingX: 8,
      paddingY: 4,
      backgroundAlpha: 0.82,
    });
    this.nameTag.x = this.width / 2 - this.nameTag.width / 2;
    this.nameTag.y = this.height + 4;

    this.addChild(this.nameTag);
  }

  /**
   * Update state for current frame.
   */
  public tick = (socket: SocketIOClient.Socket) => {
    const keyA = Keyboard.shared.getKey("a");
    const keyD = Keyboard.shared.getKey("d");
    const keyW = Keyboard.shared.getKey("w");
    const keyJ = Keyboard.shared.getKey("j");

    const input: PlayerInput = {
      a: {
        isDown: keyA.isDown,
        isPressed: keyA.isPressed,
      },
      d: {
        isDown: keyD.isDown,
        isPressed: keyD.isPressed,
      },
      w: {
        isDown: keyW.isDown,
        isPressed: keyW.isPressed,
      },
      j: {
        isDown: keyJ.isDown,
        isPressed: keyJ.isPressed,
      },
    };

    socket.emit("player-input", input);
  };

  /**
   * Apply all the properties specified in the json.
   *
   * @param json Properties to apply
   */
  public applyJson(json: PlayerJson): void {
    super.applyJson(json);
    const { state, blinking, name, saying } = json;
    this.setState(state);

    if (blinking) {
      if (!this.blinkInterval) {
        this.blinkInterval = setInterval(() => {
          this.alpha = this.alpha ? 0 : 1;
        }, Player.BLINK_INTERVAL);
      }
    } else {
      if (this.blinkInterval) {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
        this.alpha = 1;
      }
    }

    this.nameTag.setText(name);
    this.nameTag.x = this.width / 2 - this.nameTag.width / 2;
    this.nameTag.y = this.height + 4;

    if (saying) {
      this.messageBubble.setText(saying);
      this.messageBubble.x = this.width / 2 - this.messageBubble.width / 2;
      this.messageBubble.y = -this.messageBubble.height - 8;
      this.addChild(this.messageBubble);
    } else {
      this.removeChild(this.messageBubble);
    }
  }

  /**
   * Construct a player object based on the json.
   *
   * @param json Properties to initialize the player
   */
  public static fromJson(json: PlayerJson): Player {
    const player = new Player();
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
      name: this.nameTag.getText(),
      saying: this.messageBubble.getText(),
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

    if (state === PlayerState.Punch) {
      SoundManager.shared.punch.play();
    } else if (state === PlayerState.Jumping) {
      SoundManager.shared.jump.play();
    } else if (state === PlayerState.Hurt) {
      SoundManager.shared.hurt.play();
    }
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

  public get blinking() {
    return this.blinkInterval != null;
  }

  protected setFlipped(flipped: boolean) {
    if (this.flipped === flipped) return;

    this.nameTag.scale.x *= -1;
    this.nameTag.position.x = this.width / 2 - this.nameTag.width / 2;

    this.messageBubble.scale.x *= -1;
    this.messageBubble.position.x =
      this.width / 2 - this.messageBubble.width / 2;

    super.setFlipped(flipped);
  }
}

export default Player;
