import { readFileSync } from "fs"
import * as opts from "opts"
import { resolve } from 'path'
import { Language } from "./language"

export class Launcher {
    public output: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'
    public runFile: string | false = false
    public runRepl: boolean = false
    public runPipe: boolean = false
    constructor(
        private readonly config: {
            name: string
            version: string
            Formatters: Partial<typeof Formatters>
        }
    ) { }

    drive(runner: Language['driver']) {
        this.configure()
        runner.target = this.output
        let result
        if (this.runFile)
            result = runner.run(readFileSync(resolve(this.runFile)).toString())
        if (this.runPipe)
            result = runner.run(readFileSync("/dev/stdin").toString())
        // if (this.runRepl)
        //     output = new Repl(runner).run()
        const FormatFns = this.config.Formatters || Formatters
        const format = FormatFns[this.output] || Formatters[this.output]
        console.log(format(result))
        process.exit(runner.status)
    }

    configured = false
    private configure() {
        if (this.configured) return

        this.configured = true
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

        if (opts.get("version")) {
            console.log(`${this.config.name}-${this.config.version}`)
            process.exit(0)
        }
    }
}

const Formatters = {
    tokenize(stream: ReturnType<Language['engine']['tokenize']>) {
        return stream.drain().map(t => t.toString()).join('\n')
    },
    parse(ast: ReturnType<Language['engine']['parse']>) {
        return JSON.stringify(ast)
    },
    evaluate(value: ReturnType<Language['engine']['evaluate']>) {
        return value
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
