class Random {
  public static choice(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export default Random;
