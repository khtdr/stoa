import * as opts from 'opts'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Driver, Language, Lexicon, Repl, Visitable } from "."

export class CliRunner<Lx extends Lexicon, Ast extends Visitable> {
    constructor(
        readonly lang: Language<Lx, Ast>
    ) { }

    run() {
        const [driver, { runFile, runPipe, runRepl }] = this.configure()

        let result
        if (runFile)
            result = driver.run(readFileSync(resolve(runFile)).toString())
        if (runPipe)
            result = driver.run(readFileSync("/dev/stdin").toString())

        if (!runRepl) {
            console.log(result)
            process.exit(driver.status)

        } else new Repl(driver).run().then(() => {
            process.exit(driver.status)
        })
    }

    private _configuration?: [
        Driver<Lx, Ast>,
        { runFile: false | string; runPipe: boolean; runRepl: boolean; }
    ]
    private configure() {
        if (!this._configuration) {
            opts.parse([
                { description: "Displays the version and exits", short: "v", long: "version" },
                { description: "Emits the list of tokens (JSON)", short: "t", long: "tokenize" },
                { description: "Emits the parse tree (CST/JSON)", short: "p", long: "parse" },
                { description: "Launch a colorful REPL", short: "r", long: "repl" },
            ], [{ name: "file" }], true)

            this._configuration = [
                new Driver(
                    this.lang,
                    opts.get('tokenize') ? 'Tokens' : opts.get('parse') ? 'ParseTree' : 'Evaluate'
                ),
                { runFile: false, runPipe: false, runRepl: false }
            ]

            const file = opts.arg("file")
            if (file) this._configuration[1].runFile = file

            if (opts.get("repl")) this._configuration[1].runRepl = true
            else if (!file) this._configuration[1].runPipe = true

            if (opts.get("version")) {
                const { name, version, ...details } = this.lang.details
                console.log(`${name}-${version}`, details)
                process.exit(0)
            }
        }
        return this._configuration
    }
}
