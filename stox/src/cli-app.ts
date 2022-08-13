process.stdin.pause();

import fs from "fs";
import opts from "opts";
import { StoxLang } from "./stox-lang";
import { Repl } from "./repl";

opts.parse(
  [
    { short: "r", long: "repl", description: "runs the repl" },
    { short: "t", long: "tokens", description: "prints tokens and exits " },
    { short: "p", long: "parse", description: "prints parse tree and exits " },
    {
      short: "v",
      long: "version",
      description: "prints version info and exits ",
    },
  ],
  [{ name: "file" }],
  true
);

const Stox = new StoxLang();
if (opts.get("version")) {
  console.log(`stox-${Stox.version}`);
  process.exit(0);
}

const tokenize = opts.get("tokens"),
  parse = opts.get("parse");
const stage = (tokenize && "scan") || (parse && "parse") || "eval";
Stox.options({ stage });

if (opts.get("repl")) {
  const repl = new Repl(Stox);
  repl.run().finally(() => process.exit(0));
} else {
  process.stdin.resume();
  const fileName = opts.arg("file") ?? "/dev/stdin";
  const sourceCode = fs.readFileSync(fileName).toString();
  Stox.run(fileName, sourceCode);
  process.exit(Stox.errored ? 1 : 0);
}
