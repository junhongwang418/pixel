import express from "express";
import http from "http";
import SocketIO, { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import Gravity from "./physics/Gravity";
import Collision from "./physics/Collision";
import Player from "./sprite/Player";
import Enemy from "./sprite/Enemy";
import JsonLoader from "./JsonLoader";
import TileMap, { TileMapData } from "../common/TileMap";
import TileGenerator from "./TileGenerator";
import { PlayerInput } from "../common/sprite/Player";

/**
 * Entry point of the game server. Initializes the game and
 * enter the game loop.
 */
class App {
  public static readonly TICK_INTERVAL_MS = 16.66; // Equivalent to FPS 60

  private static readonly PORT = process.env.PORT || 3000;

  private players: { [id: string]: Player };
  private enemies: { [id: string]: Enemy };

  private server: http.Server;
  private io: SocketIO.Server;

  constructor() {
    this.players = {};
    this.enemies = {};

    const app = express();

    this.server = http.createServer(app);
    this.io = new SocketIO.Server(this.server);

    // Serve client code at root
    app.use(express.static("dist/client"));

    // Serve documentation at /docs
    app.use("/docs", express.static("dist/docs"));

    const loader = JsonLoader.shared;
    loader.add("dist/client/assets/map/grassland/1.json");
    loader.load(this.onLoad);
  }

  /**
   * {@link App.onLoad} is called once all the resources needed
   * for the game are loaded into memory.
   */
  private onLoad = () => {
    // create 10 enemies at random locations
    for (let i = 0; i < 10; i++) {
      const randomX = 100 + Math.random() * 300;
      const enemy = new Enemy(randomX);
      enemy.x = randomX;
      // enemy id is random
      this.enemies[uuidv4()] = enemy;
    }

    setInterval(this.tick, App.TICK_INTERVAL_MS);

    this.io.on("connection", this.onConnection);

    this.server.listen(App.PORT, () => {
      console.log(`Listening on port ${App.PORT}`);
    });
  };

  /**
   * {@link App.tick} is called every frame to update the game state.
   */
  private tick = () => {
    Gravity.shared.tick([
      ...Object.values(this.players),
      ...Object.values(this.enemies),
    ]);

    const loader = JsonLoader.shared;
    const tileMap = new TileMap(
      loader.jsons["dist/client/assets/map/grassland/1.json"] as TileMapData,
      TileGenerator.shared
    );
    Collision.shared.tick(
      Object.values(this.players),
      Object.values(this.enemies),
      tileMap
    );

    Object.values(this.enemies).forEach((e) => e.tick());
    Object.values(this.players).forEach((p) => p.tick());
  };

  /**
   * {@link App.onConnection} is called when a new client connects with
   * the server.
   *
   * @param socket The connection established between the client and the server
   */
  private onConnection = (socket: Socket) => {
    socket.on("init", (name) => this.onInit(socket, name));
    socket.on("disconnect", () => this.onDisconnect(socket));
  };

  /**
   * {@link App.onInit} is called when the client emits an `init` event
   * to the server.
   *
   * @param socket The connection between the client and the server
   * @param name The username the client passed along with `init` event
   */
  private onInit = (socket: Socket, name: string) => {
    // any new player starts at x = 300 and y = 0 for now
    this.players[socket.id] = new Player(name, 300, 0);

    socket.emit("init", {
      players: this.playerJsons,
      enemies: this.enemyJsons,
    });

    socket.broadcast.emit("create", {
      id: socket.id,
      json: this.players[socket.id].json(),
    });

    socket.on("player-input", (input) => this.onPlayerInput(socket, input));
    socket.on("chat", (text) => this.onChat(socket, text));

    setInterval(() => {
      socket.emit("update-players", this.playerJsons);
      socket.emit("update-enemies", this.enemyJsons);
    }, App.TICK_INTERVAL_MS);
  };

  /**
   * {@link App.onDisconnect} is called when the client closes the tab
   * and emits a `disconnect` event to the server.
   *
   * @param socket The old connection between the client and the sever
   */
  private onDisconnect = (socket: Socket) => {
    socket.broadcast.emit("delete", {
      id: socket.id,
    });
    delete this.players[socket.id];
  };

  /**
   * {@link App.onPlayerInput} is called when the client emits a
   * `player-input` event along with their keystroke data.
   *
   * @param socket The connection between the client and the server
   * @param input The keystroke data
   */
  private onPlayerInput = (socket: Socket, input: PlayerInput) => {
    this.players[socket.id].input(input);
  };

  private onChat = (socket: Socket, text: string) => {
    this.players[socket.id].say(text);
  };

  private get playerJsons() {
    const jsons = {};
    Object.entries(this.players).forEach(
      ([id, player]) => (jsons[id] = player.json())
    );
    return jsons;
  }

  private get enemyJsons() {
    const jsons = {};
    Object.entries(this.enemies).forEach(
      ([id, enemy]) => (jsons[id] = enemy.json())
    );
    return jsons;
  }
}

export default App;
