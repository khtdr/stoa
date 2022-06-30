/// <reference path="./deps.d.ts" />
import { readFileSync } from 'fs'
import UI from 'readline-ui'
import chalk from 'chalk'
import * as opts from "opts"
import { resolve } from 'path'
import { Language } from "./language"

export class Launcher<L5n = unknown, K = unknown> {
    public output: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'
    public runFile: string | false = false
    public runRepl: boolean = false
    public runPipe: boolean = false
    constructor(
        private readonly config: {
            name: string
            version: string
            Formatters: Partial<{
                tokenize(stream: keyof L5n): void
                parse(ast: K): void
                evaluate(value: unknown): void
            }>
        }
    ) { }

    drive(runner: Language<any, any>['driver']) {
        this.configure()
        runner.target = this.output
        const FormatFns = this.config.Formatters
        const format = FormatFns[this.output] || console.log.bind(console)

        let result
        if (this.runFile)
            result = runner.run(readFileSync(resolve(this.runFile)).toString())
        if (this.runPipe)
            result = runner.run(readFileSync("/dev/stdin").toString())

        format(result)
        if (!this.runRepl) {
            process.exit(runner.status)

        } else new Repl(runner).run(format).then(() => {
            console.log('good bye!')
            process.exit(runner.status)
        })
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

class Repl {
    constructor(
        readonly runner: Language<any, any>['driver']
    ) { }

    async run(format: (data: unknown) => void) {
        return new Promise(resolve => {
            const ui = new UI()
            const prompt = chalk`{blue ?>} `
            ui.render(prompt)
            ui.on("keypress", () => ui.render(prompt + ui.rl.line))
            ui.on("line", (line: string) => {
                ui.render(prompt + line);
                ui.end();
                ui.rl.pause();
                try {
                    console.log(line)
                    if (line == ".quit.") {
                        return resolve()
                    }
                    const value = this.runner.run(line);
                    console.log(chalk`{gray >>} ${format(value)}`);
                } catch (e) {
                    console.log(e);
                }
                ui.rl.resume();
                ui.render(prompt);
            });
        })
    }
}
