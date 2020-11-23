/**
 * When an user visit the website, they will load `index.html`,
 * which will then load `index.ts`. Run {@link App.start} in
 * this file to start the game.
 *
 * @packageDocumentation
 */

import "./style.css";
import App from "./App";

const app = new App();
app.start();
