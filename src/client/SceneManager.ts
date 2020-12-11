import App from "./App";
import Scene from "./Scene";

class SceneManager {
  public static shared = new SceneManager();

  private app: App;

  private constructor() {}

  public init(app: App) {
    this.app = app;
  }

  public setScene(scene: Scene) {
    this.app.setScene(scene);
  }
}

export default SceneManager;
