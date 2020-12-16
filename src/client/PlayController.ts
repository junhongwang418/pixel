import * as PIXI from "pixi.js";
import Collision from "./Collision";
import Gravity from "./Gravity";
import Keyboard from "./Keyboard";
import Controller from "./Controller";
import App from "./App";
import Player from "./Player";
import TextureManager from "./TextureManager";
import io from "socket.io-client";
import TileMap from "./TileMap";
import Enemy from "./Enemy";
import { PlayerJson } from "../server/Player";
import { EnemyJson } from "../server/Enemy";

/**
 * {@link PIXI.Container} with Parallax scrolling support.
 */
class Background extends PIXI.Container {
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
 * A {@link PIXI.Container} where all the game objects live.
 */
class Foreground extends PIXI.Container {
  public player: Player;
  public enemies: { [id: string]: Enemy };
  public tileMap: TileMap;

  private socket: SocketIOClient.Socket;

  // All the external players
  private players: { [id: string]: Player };

  /**
   * Initialize all the game objects in the foreground.
   */
  constructor(username: string) {
    super();

    this.player = new Player(username);
    this.socket = io();
    this.players = {};
    this.enemies = {};
    this.tileMap = new TileMap();

    this.addChild(this.tileMap);
    this.addChild(this.player);

    // SoundManager.shared.background.play();

    // register callbacks on socket events
    this.socket.on(
      "init",
      (data: {
        players: { [id: string]: PlayerJson };
        enemies: { [id: string]: EnemyJson };
      }) => {
        Object.entries(data.players).forEach(([id, json]) => {
          if (id === this.socket.id) {
            // this.player.applyJson(json);
          } else {
            const player = Player.fromJson(json);
            this.players[id] = player;
            this.addChild(player);
          }
        });
        Object.entries(data.enemies).forEach(([id, json]) => {
          const enemy = Enemy.fromJson(json);
          this.enemies[id] = enemy;
          this.addChild(enemy);
        });
      }
    );

    this.socket.on("create", (data: { id: number; json: PlayerJson }) => {
      const { id, json } = data;
      const player = Player.fromJson(json);
      this.players[id] = player;
      this.addChild(player);
    });

    this.socket.on(
      "update-player",
      (data: { id: number; json: PlayerJson }) => {
        const { id, json } = data;
        this.players[id].applyJson(json);
      }
    );

    this.socket.on("update-enemies", (data: { [id: string]: EnemyJson }) => {
      Object.entries(data).forEach(([id, json]) => {
        this.enemies[id].applyJson(json);
      });
    });

    this.socket.on("delete", (data: { id: number }) => {
      const { id } = data;
      this.removeChild(this.players[id]);
      delete this.players[id];
    });
  }

  public start() {}

  /**
   * Call this method every frame to update all the game objects in the foreground
   * including the container itself.
   */
  public tick = () => {
    this.player.tick();

    const viewportWidth = App.shared.viewport.width;
    const viewportHeight = App.shared.viewport.height;

    // make the screen chase the player
    if (this.player.center.x > viewportWidth / 2) {
      this.pivot.x = this.player.center.x;
      this.position.x = viewportWidth / 2;
    } else {
      this.pivot.x = 0;
      this.position.x = 0;
    }

    if (viewportHeight - this.player.center.y > viewportHeight / 2) {
      this.pivot.y = this.player.center.y;
      this.position.y = viewportHeight / 2;
    } else {
      this.pivot.y = 0;
      this.position.y = 0;
    }

    // notify all other connections about the player data of this connection
    this.socket.emit("update-player", this.player.json());
  };
}

class PlayController extends Controller {
  private background: Background;
  private foreground: Foreground;

  constructor(username: string) {
    super();
    this.background = new Background(1024);
    this.foreground = new Foreground(username);

    // The root containser contains two containers. Background container
    // is where the background textures are stored (something you as a
    // player can't interact with). Foreground container is where
    // everything else is stored (game objects the player can interact
    // with).
    this.addChild(this.background);
    this.addChild(this.foreground);
  }

  public start() {}

  public tick = () => {
    Gravity.shared.tick([this.foreground.player]);
    Collision.shared.tick(
      this.foreground.player,
      Object.values(this.foreground.enemies),
      this.foreground.tileMap
    );
    this.background.tick(this.foreground.player);
    this.foreground.tick();
    Keyboard.shared.tick();
  };
}

export default PlayController;
