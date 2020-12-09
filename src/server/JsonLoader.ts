import fs from "fs";

class JsonLoader {
  public static shared = new JsonLoader();

  private filePaths: string[];

  public jsons: { [key: string]: Object };

  private constructor() {
    this.filePaths = [];
    this.jsons = {};
  }

  public add(filePath: string) {
    this.filePaths.push(filePath);
  }

  public load(callback: () => void) {
    Promise.all(
      this.filePaths.map((filePath) => fs.promises.readFile(filePath))
    ).then((buffers) => {
      buffers.forEach((buffer, index) => {
        this.jsons[this.filePaths[index]] = JSON.parse(buffer.toString());
      });
      callback();
    });
  }
}

export default JsonLoader;
