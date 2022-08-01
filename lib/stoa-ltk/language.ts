import * as Lib from '.'

type RuntimeOpts = { stage: "scan" | "parse" | "eval" };

export abstract class Language<Tokens extends Lib.Lexicon, Ast extends object, Result> {
    abstract readonly Tokenizer: typeof Lib.TokenStreamClass<Tokens>;
    abstract readonly Parser: typeof Lib.Parser<Tokens, Ast>;
    abstract readonly Resolver: typeof Lib.Visitor<Ast, void>;
    abstract readonly Interpreter: typeof Lib.Visitor<Ast, Result>;
    constructor(readonly reporter: Lib.Reporter = new Lib.StdErrReporter()) { }

    private _interpreter?: Lib.Visitor<Ast, Result>
    get interpreter() {
        if (!this._interpreter)
            this._interpreter = new this.Interpreter(this.reporter)
        return this._interpreter
    }

    private _resolver?: Lib.Visitor<Ast, void>
    get resolver() {
        if (!this._resolver)
            this._resolver = new this.Resolver(this.reporter, this.interpreter)
        return this._resolver
    }

    private opts: RuntimeOpts = { stage: "eval" };
    options(opts: RuntimeOpts) {
        this.opts = opts;
    }

    public errored = false;
    run(name: string, code: string) {
        this.errored = false;
        this.reporter.pushSource(name, code);
        this.runToStage(code);
        this.reporter.popSource();
    }

    private runToStage(source: string) {
        const scanner = new this.Tokenizer(source, this.reporter);
        const tokens = scanner.drain();
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.tokenError();
        }

        if (this.opts.stage === "scan") {
            scanner.print(tokens)
            return;
        }

        const parser = new this.Parser(tokens, this.reporter);
        const ast = parser.parse();
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.parseError();
            return;
        }

        if (!ast) return

        this.resolver.visit(ast);
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.parseError();
            return;
        }

        if (this.opts.stage == "parse") {
            parser.print(ast)
            return;
        }

        if (this.errored) {
            return
        }

        this.interpreter.visit(ast);
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.runtimeError();
        }
    }
}
