/**
 * A class to represent the keyboard key.
 */
class Key {
  public readonly key: string;

  public isDown: boolean;
  public isUp: boolean;

  /**
   * @param key String representation of the keyboard key
   */
  constructor(key: string) {
    this.key = key;
    this.isDown = false;
    this.isUp = false;
  }
}

/**
 * A singleton class that represents the keyboard.
 */
class Keyboard {
  public static shared = new Keyboard();

  private keys: { [key: string]: Key } = {};

  private constructor() {
    window.addEventListener("keydown", (event) => {
      const key = this.keys[event.key] || new Key(event.key);
      key.isDown = true;
      key.isUp = false;
      this.keys[event.key] = key;
    });

    window.addEventListener("keyup", (event) => {
      // key is never null because it needs to be down before up
      const key = this.keys[event.key];
      key.isDown = false;
      key.isUp = true;
    });
  }

  /**
   * Call this function every frame to update keyboard key states.
   */
  public tick(): void {
    // clear key up event
    Object.values(this.keys).forEach((key) => (key.isUp = false));
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
