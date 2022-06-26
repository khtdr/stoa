import { readFileSync } from "fs"
import * as opts from "opts"
import { resolve } from 'path'
import { LanguageDriver } from "./language"
import { Token } from "./tokenizer"

export class Cli {
    public output: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'
    public runFile: string | false = false
    public runRepl: boolean = false
    public runPipe: boolean = false
    public showVersion: boolean
    constructor(private readonly config: { name: string; version: string }) {
        opts.parse([
            {
                long: "version", short: "v",
                description: "Displays the version and exits"
            },
            {
                long: "tokenize", short: "t",
                description: "Emits the list of tokens (JSON)",
            },
            {
                long: "parse", short: "p",
                description: "Emits the parse tree (CST/JSON)",
            },
            {
                long: "repl", short: "r",
                description: "Launch a colorful REPL",
            },
        ], [{ name: "file" }], true)

        const file = opts.arg("file")
        if (file) this.runFile = file

        if (opts.get("repl")) this.runRepl = true
        else if (!file) this.runPipe = true

        this.output = 'evaluate'
        if (opts.get('tokenize')) this.output = 'tokenize'
        if (opts.get('parse')) this.output = 'parse'

        this.showVersion = !!opts.get("version")
    }

    run(runner: LanguageDriver) {
        if (this.showVersion) {
            console.log(`${this.config.name}-${this.config.version}`)
            process.exit(0)
        }
        runner.output = this.output
        runner.formatter = Formatters[this.output]
        if (this.runFile)
            runner.run(readFileSync(resolve(this.runFile)).toString())
        // if (this.runRepl)
        //     runner.run(readFileSync("/dev/stdin").toString())
        if (this.runPipe)
            runner.run(readFileSync("/dev/stdin").toString())
        process.exit(runner.status)
    }
}

class Formatters {
    static tokenize(tokens: Token[]) {
        console.log(tokens.map(t => t.toString()))
    }
    static parse(out: any) {
        console.log(out)
    }
    static evaluate(out: any) {
        console.log(out)
    }
}

        // const ui = new UI();
        // const prompt = chalk`{blue ?>} `;
        // ui.render(prompt);

        // let frame = new Frame();
        // ui.on("keypress", () => {
        //      ui.render(prompt + ui.rl.line);
        // });
        // ui.on("line", (line: string) => {
        //      ui.render(prompt + line);
        //      ui.end();
        //      ui.rl.pause();
        //      try {
        //           if (line == ";; > quit") {
        //                process.exit();
        //           }
        //           const [value, ...result] = runText(line, frame);
        //           frame = result[0];
        //           console.log(chalk`{gray >>} ${JSON.stringify(value, null, 3)}`);
        //      } catch (e) {
        //           console.log(e);
        //      }
        //      ui.rl.resume();
        //      ui.render(prompt);
        // });
