/**
 * A class that represents a keyboard key.
 */
class Key {
  public readonly val: string;
  public isDown: boolean;
  public isUp: boolean;
  public isPressed: boolean;
  public wasPressed: boolean;

  /**
   * @param val String representation of the keyboard key
   */
  constructor(val: string) {
    this.val = val;
    this.isDown = false;
    this.isUp = false;
    this.isPressed = false;
    this.wasPressed = false;
  }
}

/**
 * A singleton class that manages `keydown` and `keyup` events.
 */
class Keyboard {
  public static shared = new Keyboard();

  private keys: { [key: string]: Key } = {};

  private constructor() {
    window.addEventListener("keydown", (event) => {
      const key = this.keys[event.key] || new Key(event.key);
      key.isDown = true;
      key.isUp = false;
      if (!key.wasPressed) {
        key.isPressed = true;
      }
      this.keys[event.key] = key;
    });

    window.addEventListener("keyup", (event) => {
      // key is never null because it needs to be down before up
      const key = this.keys[event.key];
      key.isDown = false;
      key.isUp = true;
      key.isPressed = false;
      key.wasPressed = false;
    });
  }

  /**
   * Call this function every frame to update keyboard key states.
   */
  public tick(): void {
    Object.values(this.keys).forEach((key) => {
      // clear key up event
      key.isUp = false;

      if (key.isPressed) {
        key.wasPressed = true;
      }

      // clear key press event
      key.isPressed = false;
    });
  }

  /**
   * Takes the string representation of the key and returns the key object.
   *
   * @param key String representation of key
   * @return Object representation of key
   */
  public getKey(key: string): Key {
    const keyObj = this.keys[key] || new Key(key);
    this.keys[key] = keyObj;
    return keyObj;
  }
}

export default Keyboard;
