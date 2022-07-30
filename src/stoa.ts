import fs from "fs";
import opts from "opts";
import { version } from "../package.json";
import * as Ast from "./ast";
import { Scanner } from "./scanner";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { Resolver } from "./resolver";
import * as Lib from "./lib";
import * as Runtime from "./runtime";

class Language extends Lib.Language<typeof Scanner.lexicon, Ast.Visitable, Runtime.Result> {
    Tokenizer = Scanner;
    Parser = Parser;
    Resolver = Resolver;
    Interpreter = Interpreter;
}

opts.parse(
    [
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

const fileName = opts.arg("file") ?? "/dev/stdin";
const sourceCode = fs.readFileSync(fileName).toString();
Stoa.run(fileName, sourceCode);

process.exit(Stoa.errored ? 1 : 0);
