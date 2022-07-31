import fs from "fs";
import opts from "opts";
import * as Ltk from "stoa-ltk";
import { version } from "../package.json";
import { Scanner } from "./scanner";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { Resolver } from "./resolver";
import { Repl } from './repl'
import * as Ast from "./ast";
import * as Runtime from "./runtime";

class Language extends Ltk.Language<typeof Scanner.lexicon, Ast.Visitable, Runtime.Result> {
    Tokenizer = Scanner;
    Parser = Parser;
    Resolver = Resolver;
    Interpreter = Interpreter;
}

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

if (opts.get("v")) {
    console.log(`stoa-${version}`);
    process.exit(0);
}

const Stoa = new Language();
const stage = (opts.get("t") && "scan") || (opts.get("p") && "parse") || "eval";
Stoa.options({ stage });

// const readStdin = !opts.get('r')
// const fileName = opts.arg("file") ?? readStdin ? "/dev/stdin" : "/dev/null";
const fileName = opts.arg("file") ?? "/dev/stdin";
const sourceCode = fs.readFileSync(fileName).toString();
Stoa.run(fileName, sourceCode);

// if (opts.get('r'))
//     (async () => await new Repl(Stoa).run())()
// else process.exit(Stoa.errored ? 1 : 0);
process.exit(Stoa.errored ? 1 : 0);
