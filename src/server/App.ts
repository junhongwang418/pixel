import express from "express";
import http from "http";
import SocketIO from "socket.io";
import { v4 as uuidv4 } from "uuid";
import Gravity from "./Gravity";
import Collision from "./Collision";
import Player, { PlayerJson } from "./Player";
import Enemy from "./Enemy";
import JsonLoader from "./JsonLoader";
import TileMap from "./TileMap";

class App {
  private players: { [id: string]: Player };
  private enemies: { [id: string]: Enemy };

  constructor() {
    this.players = {};
    this.enemies = {};

    const app = express();
    const server = http.createServer(app);
    const io = new SocketIO.Server(server);

    const port = process.env.PORT || 3000;

    app.use(express.static("dist/client"));
    app.use("/docs", express.static("dist/docs"));

    const loader = JsonLoader.shared;

    loader.add("dist/client/assets/map/grassland/1.json");

    loader.load(() => {
      // create enemies
      for (let i = 0; i < 10; i++) {
        const randomX = 100 + Math.random() * 300;
        const enemy = new Enemy(randomX);
        enemy.x = randomX;
        this.enemies[uuidv4()] = enemy;
      }

      const tileMap = new TileMap();

      setInterval(() => {
        // The client handles player ticks. The server
        // handles all the enemy ticks.
        Gravity.shared.tick(Object.values(this.enemies));
        Collision.shared.tick(Object.values(this.enemies), tileMap);
        Object.values(this.enemies).forEach((e) => e.tick());
      }, 16.66);

      io.on("connection", (socket) => this.onConnection(socket));

      server.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    });
  }

  private onConnection = (socket) => {
    socket.on("init", (name) => this.onInit(socket, name));
  };

  private onInit = (socket, name) => {
    this.players[socket.id] = new Player(name, 300, 0);

    const playerJsons = {};
    Object.entries(this.players).forEach(
      ([id, player]) => (playerJsons[id] = player.json())
    );

    const enemyJsons = {};
    Object.entries(this.enemies).forEach(
      ([id, enemy]) => (enemyJsons[id] = enemy.json())
    );

    socket.emit("init", {
      players: playerJsons,
      enemies: enemyJsons,
    });

    socket.broadcast.emit("create", {
      id: socket.id,
      json: this.players[socket.id].json(),
    });

    socket.on("disconnect", this.onDisconnect);
    socket.on("update-player", (json: PlayerJson) =>
      this.onUpdatePlayer(socket, json)
    );

    // send the latest enemy data to all the connections
    setInterval(() => {
      const enemyJsons = {};
      Object.entries(this.enemies).forEach(
        ([id, enemy]) => (enemyJsons[id] = enemy.json())
      );
      socket.emit("update-enemies", enemyJsons);
    }, 16.66);
  };

  private onDisconnect = (socket) => {
    socket.broadcast.emit("delete", {
      id: socket.id,
    });
    delete this.players[socket.id];
  };

  private onUpdatePlayer = (socket, json: PlayerJson) => {
    this.players[socket.id].applyJson(json);
    socket.broadcast.emit("update-player", {
      id: socket.id,
      json,
    });
  };
}

export default App;
