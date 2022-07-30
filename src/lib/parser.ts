import * as Lib from ".";

export class Parser<Lx extends Lib.Lexicon, Ast extends object> {
    constructor(
        private readonly tokens: Lib.Token<keyof Lx>[],
        protected reporter: Lib.Reporter = new Lib.StdErrReporter()
    ) { }

    parse(): Ast | undefined {
        return undefined;
    }
    print(ast?: Ast, level: 'error' | 'log' = 'log') {
        console[level](`${ast ?? ''}`)
    }

    private current = 0;

    protected match(...names: string[]): boolean {
        for (const name of names) {
            if (this.check(name)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    protected consume<Name extends keyof Lx>(name: Name, message: string): Lib.Token<Name> {
        if (this.check(name)) return this.advance() as Lib.Token<typeof name>;
        else throw `Error: ${this.peek()} ${message}`;
    }

    protected check(name: keyof Lx): boolean {
        return this.peek()?.name == name;
    }

    protected atEnd(): boolean {
        return !this.peek()?.name;
    }

    protected advance(): Lib.Token<keyof Lx> {
        if (!this.atEnd()) this.current++;
        return this.previous();
    }

    protected peek(ahead = 1): Lib.Token<keyof Lx> | undefined {
        return this.tokens[this.current + (ahead - 1)];
    }

    protected previous<Name extends keyof Lx = keyof Lx>(): Lib.Token<Name> {
        return this.tokens[this.current - 1] as Lib.Token<Name>;
    }

    protected error(token: Lib.Token, message = "Unexpected token") {
        this.reporter.error(token, message);
        return new ParseError(message);
    }
}

export class Visitor<Ast extends object, Result = string> {
    constructor(
        readonly reporter: Lib.Reporter = new Lib.StdErrReporter(),
        readonly interpreter?: any
    ) { }
    visit(node: Ast): Result {
        const name = node.constructor.name
        const fn = this[name as keyof this]
        if (typeof fn == 'function') return fn.bind(this)(node)
        throw new ParseError(`Unvisitable node: ${name} (UNIMPLEMENTED BY AUTHOR)`)
    }
}

export class ParseError extends Error { }
