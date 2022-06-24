import UI from "readline-ui";
import chalk from "chalk";
import * as opts from "opts";
import { readFileSync } from "fs";
import { version } from "../package.json";
import { lex } from "./lexer";
import { tokenize } from "./tokenizer";
import { scan } from "./scanner";
import { parse } from "./parser";
import { evaluate, Frame } from "./interpreter";

opts.parse([
     {
          long: "version",
          short: "v",
          description: "Displays the version and exits"
     },
     {
          long: "tokenize",
          short: "t",
          description: "Emits the list of tokens (JSON)",
     },
     {
          long: "parse",
          short: "p",
          description: "Emits the parse tree (CST/JSON)",
     },
     {
          long: "repl",
          short: "r",
          description: "Launch a colorful REPL",
     },
],
     [{ name: "file" }],
     true
);

if (opts.get("version")) {
     console.log("stoa", version);
     process.exit();
}

if (opts.arg("file")) {
     runFile(`${opts.arg("file")}`);
     process.exit();
}

if (opts.get("repl")) {
     runRepl();
} else {
     runPipe();
}

function runText(
     program: string,
     frame: Frame = new Frame()
):
     | [ReturnType<typeof tokenize> | ReturnType<typeof parse>, Frame]
     | ReturnType<typeof evaluate> {
     const lexemes = lex(program);
     const tokens = tokenize(lexemes);
     if (opts.get("tokenize")) return [tokens, frame];

     const scanner = scan(tokens);
     const ast = parse(scanner);
     if (opts.get("parse")) return [ast, frame];

     return evaluate(ast, frame);
}

function runFile(fileName: string) {
     const program = readFileSync(fileName).toString();
     const output = runText(program)[0];
     console.log(JSON.stringify(output, null, 3));
}

function runPipe() {
     const program = readFileSync("/dev/stdin").toString();
     console.log(runText(program)[0]);
}

function runRepl() {
     console.log(chalk`{red ╔═╗╔╦╗╔═╗╔═╗}  {gray ┬─┐┌─┐┌─┐┬  }`);
     console.log(chalk`{red ╚═╗ ║ ║ ║╠═╣}  {gray │ │├┤ │ ││  }`);
     console.log(chalk`{red ╚═╝ ╩ ╚═╝╩ ╩}  {gray ├┬┘│  ├─┘│  }`);
     console.log(chalk`─────────── - {gray ┴└─└─┘┴  ┴─┘}`);
     console.log(chalk`{gray version:} v${version}`);
     console.log(chalk`{gray to exit:} ctrl+d`);
     const ui = new UI();
     const prompt = chalk`{blue ?>} `;
     ui.render(prompt);

     let frame = new Frame();
     ui.on("keypress", () => {
          ui.render(prompt + ui.rl.line);
     });
     ui.on("line", (line: string) => {
          ui.render(prompt + line);
          ui.end();
          ui.rl.pause();
          try {
               if (line == ";; > quit") {
                    process.exit();
               }
               const [value, ...result] = runText(line, frame);
               frame = result[0];
               console.log(chalk`{gray >>} ${JSON.stringify(value, null, 3)}`);
          } catch (e) {
               console.log(e);
          }
          ui.rl.resume();
          ui.render(prompt);
     });
}
