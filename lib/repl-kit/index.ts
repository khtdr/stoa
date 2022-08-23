import { IncompleteException } from "./errors";
import { Line } from "./ui";

export class Repl {
  constructor(
    readonly lang: {
      name: string;
      run(source: string): void;
    }
  ) {}

  async run() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    console.log("help: ?⏎");
    console.log("exit: CTRL-d");
    process.stdin.resume();

    let line = new Line(false, false);
    line.render();

    return new Promise((resolve) => {
      process.stdin.on("data", (key) => {
        // console.log({ key });
        process.stdin.pause();
        if (["\x01"].includes(key.toString())) {
          // CTRL a
          // go to beginning of line
        }
        if (["\x04"].includes(key.toString())) {
          // CTRL d
          process.stdin.destroy();
          resolve(undefined);
        }
        if (["\x05"].includes(key.toString())) {
          // CTRL a
          // go to end of line
        }
        if (["\x0B"].includes(key.toString())) {
          // CTRL k
          line.clearTilEnd();
        }
        if (!key.toString().match(/[\p{Cc}\p{Cn}\p{Cs}]+/gu)) {
          line.insert(key.toString());
        }
        if ("\x1B[C" == key.toString()) {
          line.right();
        }
        if ("\x1B[D" == key.toString()) {
          line.left();
        }
        if (["\x7F"].includes(key.toString())) {
          line.backspace();
        }
        if (["\r", "\n"].includes(key.toString())) {
          // Enter
          line.complete();
          const command = line.input.text.trim();
          if (command) {
            try {
              this.lang.run(command);
              line = new Line(false, false);
            } catch (e) {
              if (e instanceof IncompleteException) {
                line = new Line(false, true);
              } else {
                line = new Line(true, false);
              }
            }
          } else {
            line = new Line(false, false);
          }
          line.render();
        }
        process.stdin.resume();
      });
    });
  }
}
