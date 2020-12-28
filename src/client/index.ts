/**
 * When an user visit the website, they will load `index.html`,
 * which will then load `index.ts`. Call {@link App.start} in
 * this file to start the game.
 *
 * @packageDocumentation
 */

import App from "./App";
import LoadingController from "./controller/LoadingController";
import "./style.css";
import WebFontLoader from "./WebFontLoader";

// Before starting the Pixi application, load
// all the fonts needed for the game.
const loader = WebFontLoader.shared;
loader.add(WebFontLoader.DEFAULT_FONT);
loader.load(() => {
  App.shared.setController(new LoadingController());
});
