const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static("dist/client"));

const players = {};

io.on("connection", (socket) => {
  console.log(`player with id ${socket.id} joined the game`);

  socket.emit("init", players);

  players[socket.id] = {
    x: 0,
    y: 0,
    state: 0,
    scaleX: 1,
  };
  socket.broadcast.emit("create", {
    id: socket.id,
  });

  socket.on("disconnect", () => {
    console.log(`player with id ${socket.id} left the game`);
    socket.broadcast.emit("delete", {
      id: socket.id,
    });
    delete players[socket.id];
  });

  socket.on("update", ({ x, y, state, scaleX }) => {
    socket.broadcast.emit("update", {
      id: socket.id,
      x,
      y,
      state,
      scaleX,
    });
    players[socket.id].x = x;
    players[socket.id].y = y;
    players[socket.id].state = state;
    players[socket.id].scaleX = scaleX;
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
