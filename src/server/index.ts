import express from "express";
import http from "http";
import SocketIO from "socket.io";
import { v4 as uuidv4 } from "uuid";
import Gravity from "./Gravity";
import Collision from "./Collision";
import Player, { PlayerJson } from "./Player";
import Enemy from "./Enemy";

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server);

const port = process.env.PORT || 3000;

app.use(express.static("dist/client"));
app.use("/docs", express.static("dist/docs"));

const players: { [id: string]: Player } = {};
const enemies: { [id: string]: Enemy } = {};

// create enemies
for (let i = 0; i < 10; i++) {
  const randomX = 100 + Math.random() * 300;
  const enemy = new Enemy(randomX);
  enemy.x = randomX;
  enemies[uuidv4()] = enemy;
}

setInterval(() => {
  Gravity.shared.tick(enemies);
  Collision.shared.tick(enemies);
  Object.values(enemies).forEach((e) => e.tick());
}, 16.66);

io.on("connection", (socket) => {
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

  players[socket.id] = new Player();

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

  setInterval(() => {
    const enemyJsons = {};
    Object.entries(enemies).forEach(
      ([id, enemy]) => (enemyJsons[id] = enemy.json())
    );
    socket.emit("update-enemies", enemyJsons);
  }, 16.66);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
