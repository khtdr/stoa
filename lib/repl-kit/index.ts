import { lineKeyBinder } from "./key-bindings";
import { Runnable } from "./runnable";

export class Repl {
  constructor(readonly lang: Runnable) {}

  spashScreen() {
    console.log("help: ?⏎");
    console.log("exit: CTRL-d");
  }

  async run() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");
    this.spashScreen();
    process.stdin.resume();

    return new Promise((resolve) => {
      let apply = lineKeyBinder(this.lang, () => {
        process.stdin.destroy();
        resolve(undefined);
      });
      process.stdin.on("data", (key) => {
        apply(key);
        process.stdin.resume();
      });
    });
  }
}
