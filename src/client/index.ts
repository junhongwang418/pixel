/**
 * When an user visit the website, they will load `index.html`,
 * which will then load `index.ts`. Instantiate {@link App} in
 * this file to start the game.
 *
 * @packageDocumentation
 */

import "./style.css";
import App from "./App";

// Load google fonts before starting
// @ts-ignore
window.WebFontConfig = {
  google: {
    families: ["VT323"],
  },

  active() {
    new App();
  },
};

// include the web-font loader script
(function () {
  const wf = document.createElement("script");
  wf.src = `${
    document.location.protocol === "https:" ? "https" : "http"
  }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = "text/javascript";
  wf.async = true;
  const s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wf, s);
})();
