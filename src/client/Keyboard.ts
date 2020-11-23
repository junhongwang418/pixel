/**
 * A class to represent the keyboard key.
 */
class Key {
  private _key: string;
  private _isDown: boolean;
  private _isUp: boolean;

  /**
   * @param key String representation of the keyboard key
   */
  constructor(key: string) {
    this._key = key;
    this._isDown = false;
    this._isUp = false;
  }

  /**
   * Call this function `keydown` or `keyup` event is detected
   * to update the state of the key.
   *
   * @param isDown Whether the key is down
   */
  public setIsDown(isDown: boolean): void {
    this._isDown = isDown;
  }

  /**
   * Call this function `keydown` or `keyup` event is detected
   * to update the state of the key.
   *
   * @param isDown Whether the key is up
   */
  public setIsUp(isUp: boolean): void {
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
      // key is never null because it needs to be down before up
      const key = this._keys[event.key];
      key.setIsDown(false);
      key.setIsUp(true);
    });
  }

  /**
   * Call this function every frame to update keyboard key states.
   */
  public tick(): void {
    // clear key up event
    Object.values(this._keys).forEach((key) => key.setIsUp(false));
  }

  /**
   * Takes the string representation of the key and returns the key object.
   *
   * @param key String representation of key
   * @return Object representation of key
   */
  public getKey(key: string): Key {
    const keyObj = this._keys[key] || new Key(key);
    this._keys[key] = keyObj;
    return keyObj;
  }
}

export default Keyboard;
