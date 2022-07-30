import * as Lib from '.'

export abstract class Language<Tokens extends Lib.Lexicon, Ast extends object, Result> {
    abstract readonly Tokenizer: typeof Lib.TokenStreamClass<Tokens>;
    abstract readonly Parser: typeof Lib.Parser<Tokens, Ast>;
    abstract readonly Resolver: typeof Lib.Visitor<Ast, void>;
    abstract readonly Interpreter: typeof Lib.Visitor<Ast, Result>;
    constructor(readonly reporter: Lib.Reporter = new Lib.StdErrReporter()) { }

    private opts: { stage: "scan" | "parse" | "eval" } = { stage: "eval" };
    options(opts: typeof this.opts) {
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
        const interpreter = new this.Interpreter(this.reporter);
        const resolver = new this.Resolver(this.reporter, interpreter);

        const ast = parser.parse();
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.parseError();
            return;
        }

        if (!ast) return

        resolver.visit(ast);
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.parseError();
            return;
        }

        if (this.opts.stage == "parse") {
            parser.print(ast)
            return;
        }

        interpreter.visit(ast);
        if (this.reporter.errors) {
            this.errored = true;
            this.reporter.runtimeError();
        }
    }
}
