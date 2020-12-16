/**
 * A singleton class that helps you load Google Fonts.
 * Use {@link WebFontLoader.add} to add a font family to load.
 * Once all the fonts to load are added, call
 * {@link WebFontLoader.load} to start loading the fonts.
 *
 * @see https://github.com/typekit/webfontloader
 * @see https://pixijs.io/examples/#/text/webfont.js
 */
class WebFontLoader {
  public static shared = new WebFontLoader();

  private fontFamilies: string[];

  private constructor() {
    this.fontFamilies = [];
  }

  /**
   * Add a font family to load. The font will not be
   * loaded until {@link WebFontLoader.load} is called.
   *
   * @param fontFamily The font family to load later
   */
  public add(fontFamily: string) {
    this.fontFamilies.push(fontFamily);
  }

  /**
   * Load all the fonts in {@link WebFontLoader.fontFamilies}.
   *
   * @param callback The function to invoke once all the fonts are loaded
   */
  public load(callback: () => void) {
    // web-font loader script will read WebFontConfig
    // to determine the fonts to load and what to do
    // next when all fonts are loaded
    // @ts-ignore
    window.WebFontConfig = {
      google: {
        families: this.fontFamilies,
      },

      active() {
        callback();
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
  }
}

export default WebFontLoader;
