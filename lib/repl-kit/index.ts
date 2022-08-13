export class Repl {
  constructor(readonly lang: any) {}

  prompt_width = 0;
  prompt() {
    this.prompt_width = 2;
    process.stdout.write("> ");
  }

  async run() {
    const { stdin, stdout } = process;
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    console.log("help: ?⏎");
    console.log("exit: CTRL-d");
    stdin.resume();

    let line = "";
    this.prompt();

    return new Promise((resolve) => {
      stdin.on("data", (key) => {
        // console.log({ key });
        stdin.pause();
        if (["\x04"].includes(key.toString())) {
          // CTRL-d
          stdin.destroy();
          resolve(undefined);
        }
        if (!key.toString().match(/[\p{Cc}\p{Cn}\p{Cs}]+/gu)) {
          line += key.toString();
          stdout.write(key);
        }
        if ("\x1B[C" == key.toString()) {
          process.stdout.moveCursor(-1, 0);
        }
        if ("\x1B[D" == key.toString()) {
          process.stdout.moveCursor(1, 0);
        }
        if (["\x7F"].includes(key.toString())) {
          line = line.substring(0, line.length - 1);
          process.stdout.cursorTo(0);
          process.stdout.clearLine(0);
          this.prompt();
          stdout.write(line);
          // process.stdout.write("\x08");
        }
        if (["\r", "\n"].includes(key.toString())) {
          process.stdout.moveCursor(0, 1);
          process.stdout.cursorTo(0);
          console.log("");
          this.lang.run("repl", line);
          line = "";
          this.prompt();
        }
        stdin.resume();
      });
    });
  }
}
