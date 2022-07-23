import * as opts from "opts";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Driver, Language, Lexicon, Repl } from ".";

export class CliDriver<Lx extends Lexicon, Ast extends object> {
    constructor(
        readonly lang: Language<Lx, Ast>,
        readonly treewalkers: Partial<{
            Printer: any;
            Evaluator: any;
        }> = {}
    ) { }

    run() {
        const [driver, { runFile, runPipe, runRepl, tokenize }] = this.configure();
        if (runFile) driver.run(readFileSync(resolve(runFile)).toString());
        if (runPipe) driver.run(readFileSync("/dev/stdin").toString());
        if (runRepl) {
            new Repl(driver).run(tokenize).then(() => {
                process.exit(driver.status);
            });
        } else {
            process.exit(driver.status);
        }
    }

    private _configuration?: [
        Driver<Lx, Ast>,
        { tokenize: boolean; runFile: false | string; runPipe: boolean; runRepl: boolean }
    ];
    private configure() {
        if (!this._configuration) {
            opts.parse(
                [
                    {
                        description: "Displays the version and exits",
                        short: "v",
                        long: "version",
                    },
                    {
                        description: "Emits the list of tokens (JSON)",
                        short: "t",
                        long: "tokenize",
                    },
                    {
                        description: "Emits the parse tree (CST/JSON)",
                        short: "p",
                        long: "parse",
                    },
                    { description: "Launches a colorful REPL", short: "r", long: "repl" },
                ],
                [{ name: "file" }],
                true
            );

            this._configuration = [
                new Driver(
                    this.lang,
                    opts.get("parse")
                        ? new this.treewalkers.Printer()
                        : new this.treewalkers.Evaluator()
                ),
                { tokenize: !!opts.get('tokenize'), runFile: false, runPipe: false, runRepl: false },
            ];

            const file = opts.arg("file");
            if (file) this._configuration[1].runFile = file;

            if (opts.get("repl")) this._configuration[1].runRepl = true;
            else if (!file) this._configuration[1].runPipe = true;

            if (opts.get("version")) {
                const { name, version, ...details } = this.lang.details;
                console.log(`${name}-${version}`, details);
                process.exit(0);
            }
        }
        return this._configuration;
    }
}
