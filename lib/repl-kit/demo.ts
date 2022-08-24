import { IncompleteException, InvalidException } from "./errors";
import { Repl } from "./index";
import { Runnable } from "./runnable";

class Lang implements Runnable {
  constructor(readonly name: string) {}
  run(source: string) {
    const code = source.trim();
    if (!code) return;
    if (code.match(/[<{}>]/)) throw new InvalidException();
    if (!code.endsWith(";")) throw new IncompleteException();
    console.log(source);
  }
}

const repl = new Repl(new Lang("sentences"));
repl.run();
