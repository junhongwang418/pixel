/**
 * A class to represent the keyboard key.
 * @class
 *
 * @constructor
 */
class Key {
  private _key: string;
  private _isDown = false;
  private _isUp = false;

  constructor(key: string) {
    this._key = key;
  }

  public setIsDown(isDown: boolean) {
    this._isDown = isDown;
  }

  public setIsUp(isUp: boolean) {
    this._isUp = isUp;
  }

  public get isDown(): boolean {
    return this._isDown;
  }

  public get isUp(): boolean {
    return this._isUp;
  }

  public get key(): string {
    return this._key;
  }
}

/**
 * A singleton class that represents the keyboard.
 * @class
 *
 * @constructor
 */
class Keyboard {
  public static shared = new Keyboard();

  private _keys: { [key: string]: Key } = {};

  private constructor() {
    window.addEventListener("keydown", (event) => {
      const key = this._keys[event.key] || new Key(event.key);
      key.setIsDown(true);
      key.setIsUp(false);
      this._keys[event.key] = key;
    });

    window.addEventListener("keyup", (event) => {
      // key is never null by logic
      const key = this._keys[event.key];
      key.setIsDown(false);
      key.setIsUp(true);
    });
  }

  /**
   * Update state for current frame.
   */
  public tick(): void {
    // clear key up event
    Object.values(this._keys).forEach((key) => key.setIsUp(false));
  }

  /**
   * Takes the string representation of the key and returns the key object.
   * @param {string} key
   * @return {Key}
   */
  public getKey(key: string): Key {
    const keyObj = this._keys[key] || new Key(key);
    this._keys[key] = keyObj;
    return keyObj;
  }
}

export default Keyboard;
