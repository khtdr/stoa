import { StdReporter } from ".";

export type Lexeme = string | RegExp | ((text: string) => undefined | string);
export type Lexicon = Record<string, Lexeme>;
const ERROR_TOKEN = "__stoa__::error";


export class Token<Name = string> {
    constructor(
        readonly name: Name,
        readonly text: string,
        readonly pos: { line: number; column: number }
    ) { }
    toString() {
        const pos = `[${this.pos.line},${this.pos.column}]`;
        return `${this.name}${pos}`;
    }
}

export class TokenStream<Lx extends Lexicon> {
    private generator: Generator<Token<keyof Lx>>;
    constructor(
        source: string,
        lexicon: Lx = {} as Lx,
        readonly reporter = new StdReporter()
    ) {
        this.generator = tokenGenerator(source, lexicon);
    }

    private buffer: (Token<keyof Lx> | undefined)[] = [];
    take(): Token<keyof Lx> | undefined {
        this.peek();
        return this.buffer.shift();
    }
    peek(): Token<keyof Lx> | undefined {
        if (!this.buffer.length) this.buffer.push(this.next());
        return this.buffer[0];
    }
    drain(): Token<keyof Lx>[] {
        let token, tokens = [];
        while ((token = this.take())) tokens.push(token);
        return tokens;
    }

    private eof = false
    private next(): Token<keyof Lx> | undefined {
        if (this.eof) return
        while (true) {
            const token = this.generator.next().value;
            if (!token) {
                this.eof = true;
                break;
            }

            if (token.name.toString().startsWith("_")) continue;
            if (token.name == ERROR_TOKEN) {
                this.err(token);
                continue;
            }
            return token;
        }
    }

    public error = false;
    private err(token: Token) {
        this.error = true;
        const { text, pos: { line, column } } = token;
        this.reporter.error(
            token,
            `Syntax error near ${text} at ${line}:${column}`
        );
    }
}

export class TokenStreamClassFactory {
    static buildTokenStreamClass<Lx extends Lexicon>(
        lexicon: Lx
    ): typeof TokenStream & { TOKENS: Record<keyof Lx, keyof Lx> } {
        const TOKENS = Object.keys(lexicon).reduce(
            (a, c) => ((a[c as keyof Lx] = c), a),
            {} as Record<keyof Lx, keyof Lx>
        );
        class TokenStreamClassFactoryClass extends TokenStream<{}> {
            constructor(source: string) {
                super(source, lexicon);
            }
            static TOKENS = TOKENS;
        }
        return TokenStreamClassFactoryClass;
    }
}

function* tokenGenerator<Lx extends Lexicon>(
    source: string,
    lexicon: Lx
): Generator<Token<keyof Lx>> {
    let idx = 0,
        line = 1,
        column = 1;
    while (idx < source.length) {
        const [name = ERROR_TOKEN, text = source[idx]] = longest(possible());
        const token = new Token(name, text, pos());

        const lines = text.split("\n").length;
        if (lines > 1) {
            line += lines - 1;
            column = text.length - text.lastIndexOf("\n");
        } else column += text.length;
        idx += text.length;
        yield token;
    }

    function pos() {
        return { line: line, column: column };
    }
    function longest(candidates: [keyof Lx, string][]) {
        if (!candidates.length) return [];
        return candidates.reduce((longest, current) =>
            current[1]!.length > longest[1]!.length ? current : longest
        );
    }
    function possible() {
        const candidates: [keyof Lx, string][] = [];
        Object.entries(lexicon).map(([name, rule]) => {
            if (typeof rule == "function") {
                const text = rule(source.substring(idx));
                if (text !== undefined) candidates.push([name, text]);
            } else if (typeof rule != "string") {
                const regex = new RegExp(`^${rule.source}`, rule.flags);
                const match = regex.exec(source.substring(idx));
                if (match) return candidates.push([name, match[0]]);
            } else if (source.substring(idx, idx + rule.length) == rule) {
                return candidates.push([name, rule]);
            }
        });
        return candidates;
    }
}
