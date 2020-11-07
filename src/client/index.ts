import * as PIXI from "pixi.js";
import Keyboard from "./Keyboard";
import Player from "./Player";
import io from "socket.io-client";

import "./style.css";

// Disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// scale the application view content
app.stage.scale.set(4);

// make the application view full screen
app.renderer.resize(window.innerWidth, window.innerHeight);

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;

// load the texture we need
loader.add("assets/mrman/idle_0.png");
loader.add("assets/mrman/idle_1.png");
loader.add("assets/mrman/idle_2.png");
loader.add("assets/mrman/idle_3.png");

loader.add("assets/mrman/run_0.png");
loader.add("assets/mrman/run_1.png");
loader.add("assets/mrman/run_2.png");
loader.add("assets/mrman/run_3.png");
loader.add("assets/mrman/run_4.png");
loader.add("assets/mrman/run_5.png");

loader.onProgress.add((loader) => {
  console.log(`progress: ${loader.progress}%`);
});

const players: { [key: string]: Player } = {};

// callback when all the files are loaded
loader.load(() => {
  console.log("All files loaded");

  const socket = io();

  const mrman = new Player();

  players[socket.id] = mrman;

  // add the sprite to the scene
  app.stage.addChild(mrman);

  app.ticker.add((deltaMs) => {
    mrman.tick(deltaMs);
    Keyboard.shared.tick();
    socket.emit("update", {
      x: mrman.x,
      y: mrman.y,
      state: mrman.state,
      scaleX: mrman.scale.x,
    });
  });

  socket.on(
    "init",
    (data: {
      [key: string]: {
        x: number;
        y: number;
        state: number;
        scaleX: number;
      };
    }) => {
      Object.entries(data).forEach(([playerId, playerData]) => {
        const player = new Player();
        player.position.set(playerData.x, playerData.y);
        player.setState(playerData.state);
        player.scale.x = playerData.scaleX;
        players[playerId] = player;
        app.stage.addChild(player);
      });
    }
  );

  socket.on("create", ({ id }) => {
    const player = new Player();
    players[id] = player;
    app.stage.addChild(player);
  });

  socket.on("update", ({ id, x, y, state, scaleX }) => {
    players[id].position.set(x, y);
    players[id].setState(state);
    players[id].scale.x = scaleX;
  });

  socket.on("delete", ({ id }) => {
    app.stage.removeChild(players[id]);
    delete players[id];
  });
});
