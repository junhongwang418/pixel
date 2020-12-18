/**
 * Serves client code at root. Delegates the game logic
 * to {@link App}.
 *
 * @packageDocumentation
 */

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

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server);

const port = process.env.PORT || 3000;

app.use(express.static("dist/client"));
app.use("/docs", express.static("dist/docs"));

const loader = JsonLoader.shared;

loader.add("dist/client/assets/map/grassland/1.json");

loader.load(() => {
  const players: { [id: string]: Player } = {};
  const enemies: { [id: string]: Enemy } = {};

  // create enemies
  for (let i = 0; i < 10; i++) {
    const randomX = 100 + Math.random() * 300;
    const enemy = new Enemy(randomX);
    enemy.x = randomX;
    enemies[uuidv4()] = enemy;
  }

  const tileMap = new TileMap();

  setInterval(() => {
    // The client handles player ticks. The server
    // handles all the enemy ticks.
    Gravity.shared.tick(Object.values(enemies));
    Collision.shared.tick(Object.values(enemies), tileMap);
    Object.values(enemies).forEach((e) => e.tick());
  }, 16.66);

  io.on("connection", (socket) => {
    socket.on("init", (name) => {
      players[socket.id] = new Player(name, 300, 0);

      const playerJsons = {};
      Object.entries(players).forEach(
        ([id, player]) => (playerJsons[id] = player.json())
      );

      const enemyJsons = {};
      Object.entries(enemies).forEach(
        ([id, enemy]) => (enemyJsons[id] = enemy.json())
      );

      socket.emit("init", {
        players: playerJsons,
        enemies: enemyJsons,
      });

      socket.broadcast.emit("create", {
        id: socket.id,
        json: players[socket.id].json(),
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("delete", {
          id: socket.id,
        });
        delete players[socket.id];
      });

      socket.on("update-player", (json: PlayerJson) => {
        players[socket.id].applyJson(json);

        socket.broadcast.emit("update-player", {
          id: socket.id,
          json,
        });
      });

      // send the latest enemy data to all the connections
      setInterval(() => {
        const enemyJsons = {};
        Object.entries(enemies).forEach(
          ([id, enemy]) => (enemyJsons[id] = enemy.json())
        );
        socket.emit("update-enemies", enemyJsons);
      }, 16.66);
    });
  });

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
