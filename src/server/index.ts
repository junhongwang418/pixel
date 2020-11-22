import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import { PlayerJson } from "../client/Player";

const app = express();
const server = http.createServer(app);
const io = new SocketIO.Server(server);

const port = process.env.PORT || 3000;

app.use(express.static("dist/client"));

const players: { [id: string]: PlayerJson } = {};

io.on("connection", (socket) => {
  socket.emit("init", players);

  players[socket.id] = {
    x: 0,
    y: 0,
    state: 0,
    scaleX: 1,
  };

  socket.broadcast.emit("create", {
    id: socket.id,
    json: players[socket.id],
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("delete", {
      id: socket.id,
    });
    delete players[socket.id];
  });

  socket.on("update", (json: PlayerJson) => {
    players[socket.id] = json;

    socket.broadcast.emit("update", {
      id: socket.id,
      json: players[socket.id],
    });
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
