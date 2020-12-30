import * as PIXI from "pixi.js";
import Keyboard from "../Keyboard";
import Controller from "./Controller";
import App from "../App";
import Player from "../sprite/Player";
import TextureManager from "../TextureManager";
import io from "socket.io-client";
import TileMap from "../../server/TileMap";
import Enemy from "../sprite/Enemy";
import { PlayerJson } from "../../server/sprite/Player";
import { EnemyJson } from "../../server/sprite/Enemy";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Color from "../Color";
import TileGenerator from "../TileGenerator";
import JsonManager from "../JsonManager";

/**
 * View for {@link PlayController}. Handles parallax scrolling.
 */
class BackgroundView extends PIXI.Container {
  private tilingSprites: PIXI.TilingSprite[];

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

    this.tilingSprites = [];
    for (let i = 0; i < textures.length; i++) {
      const tilingSprite = new PIXI.TilingSprite(
        textures[i],
        width,
        textures[i].height
      );
      tilingSprite.scale.set(3);
      this.tilingSprites.push(tilingSprite);
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
   */
  public tick(player: Player) {
    const viewportWidth = App.shared.viewport.width;
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

/**
 * View for {@link PlayController}. Renders the player, enemy, and
 * tiles.
 */
class ForegroundView extends PIXI.Container {
  private tileMap: TileMap;

  /**
   * Initialize all the game objects in the foreground.
   *
   * @param tileMap
   */
  constructor() {
    super();
  }

  public init(tileMap: TileMap) {
    this.tileMap = tileMap;
  }

  /**
   * Call this method every frame to update all the game objects in the foreground
   * including the container itself.
   *
   * @param player
   */
  public tick = (player: Player) => {
    const viewportWidth = App.shared.viewport.width;
    const viewportHeight = App.shared.viewport.height;

    // make the screen chase the player
    if (player.center.x > viewportWidth / 2) {
      this.pivot.x = player.center.x;
      this.position.x = viewportWidth / 2;
    } else {
      this.pivot.x = 0;
      this.position.x = 0;
    }

    const mapOffset =
      App.shared.viewport.height -
      this.tileMap.data.height * this.tileMap.data.tileheight;

    if (viewportHeight - player.center.y > viewportHeight / 2) {
      this.pivot.y = player.center.y;
      this.position.y = mapOffset + viewportHeight / 2;
    } else {
      this.pivot.y = 0;
      this.position.y = mapOffset;
    }
  };
}

/**
 * View for {@link PlayController}. Renders the chat window.
 */
class UIView extends PIXI.Container {
  constructor(chatInput: Input, chatSendButton: Button) {
    super();

    chatInput.y = App.shared.viewport.height - chatInput.height;
    chatSendButton.x = chatInput.x + chatInput.width;
    chatSendButton.y = chatInput.y;

    this.addChild(chatInput);
    this.addChild(chatSendButton);
  }
}

class PlayController extends Controller {
  private socket: SocketIOClient.Socket;

  private backgroundView: BackgroundView;
  private foregroundView: ForegroundView;
  private uiView: UIView;

  private chatInput: Input;
  private chatSendButton: Button;

  private tileMap: TileMap;

  private get player() {
    return this.players[this.socket.id];
  }

  private players: { [id: string]: Player };
  private enemies: { [id: string]: Enemy };

  constructor(username: string) {
    super();

    this.socket = io();
    this.players = {};
    this.enemies = {};

    this.players[this.socket.id] = this.player;

    this.chatInput = new Input(25, {
      borderWidth: 1,
      borderColor: Color.WHITE,
      backgroundColor: Color.BLACK,
      backgroundAlpha: 0.72,
      paddingX: 16,
      paddingY: 8,
      color: Color.WHITE,
    });
    this.chatSendButton = new Button("Send", {
      borderWidth: 1,
      borderColor: Color.WHITE,
      backgroundColor: Color.BLACK,
      backgroundAlpha: 0.72,
      color: Color.WHITE,
      paddingX: 16,
      paddingY: 8,
    });

    this.backgroundView = new BackgroundView(1024);
    this.foregroundView = new ForegroundView();
    this.uiView = new UIView(this.chatInput, this.chatSendButton);

    this.tileMap = new TileMap(
      JsonManager.shared.getTileMapData(),
      new TileGenerator(this.foregroundView)
    );

    this.foregroundView.init(this.tileMap);

    this.chatSendButton.onClick(this.sendChat);

    this.addChild(this.backgroundView);
    this.addChild(this.foregroundView);
    this.addChild(this.uiView);

    // tell the server to log in a new user
    this.socket.emit("init", username);

    // register callbacks on socket events
    this.socket.on("init", this.onInit);
    this.socket.on("create", this.onCreate);
    this.socket.on("update-players", this.onUpdatePlayers);
    this.socket.on("update-enemies", this.onUpdateEnemies);
    this.socket.on("delete", this.onDelete);
  }

  public start() {}

  public tick = () => {
    if (this.player) {
      if (this.chatInput.getFocused()) {
        this.chatInput.tick();
      } else {
        this.player.tick(this.socket);
      }

      if (this.chatInput.getFocused()) {
        const enterKey = Keyboard.shared.getKey("Enter");
        if (enterKey.isPressed) {
          this.sendChat();
        }
      }

      this.backgroundView.tick(this.player);
      this.foregroundView.tick(this.player);

      // notify all other connections about the player data of this connection
      this.socket.emit("update-player", this.player.json());
    }
  };

  private sendChat = () => {
    if (this.chatInput.getValue()) {
      // this.player.say(this.chatInput.getValue());
      this.socket.emit("chat", this.chatInput.getValue());
      this.chatInput.clear();
      this.chatInput.setFocused(false);
    }
  };

  private onInit = (data: {
    players: { [id: string]: PlayerJson };
    enemies: { [id: string]: EnemyJson };
  }) => {
    Object.entries(data.players).forEach(([id, json]) => {
      const player = Player.fromJson(json);
      this.players[id] = player;
      this.foregroundView.addChild(player);
    });
    Object.entries(data.enemies).forEach(([id, json]) => {
      const enemy = Enemy.fromJson(json);
      this.enemies[id] = enemy;
      this.foregroundView.addChild(enemy);
    });
  };

  private onCreate = (data: { id: number; json: PlayerJson }) => {
    const { id, json } = data;
    const player = Player.fromJson(json);
    this.players[id] = player;
    this.foregroundView.addChild(player);
  };

  private onUpdatePlayers = (data: { [id: string]: PlayerJson }) => {
    Object.entries(data).forEach(([id, json]) => {
      this.players[id].applyJson(json);
    });
  };

  private onUpdateEnemies = (data: { [id: string]: EnemyJson }) => {
    Object.entries(data).forEach(([id, json]) => {
      this.enemies[id].applyJson(json);
    });
  };

  private onDelete = (data: { id: number }) => {
    const { id } = data;
    this.foregroundView.removeChild(this.players[id]);
    delete this.players[id];
  };
}

export default PlayController;
