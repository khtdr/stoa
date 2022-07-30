import * as Lib from ".";

export type Lexeme = string | RegExp |
    ((text: string, reporter: Lib.StdReporter, line: number, column: number) => undefined | string);
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
        lexicon: Lx,
        readonly reporter: Lib.Reporter, line = 1, column = 1
    ) {
        this.generator = tokenGenerator(source, lexicon, reporter, line, column);
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

function* tokenGenerator<Lx extends Lexicon>(
    source: string,
    lexicon: Lx,
    reporter: Lib.Reporter,
    start_line = 1, start_column = 1
): Generator<Token<keyof Lx>> {
    let idx = 0,
        line = start_line,
        column = start_column;
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
    function longest(candidates: [keyof Lx, string, boolean][]) {
        if (!candidates.length) return [];
        if (candidates.length == 1) return candidates[0];
        return candidates.reduce((longest, current) => {
            if (current[1].length > longest[1].length) return current
            if (current[1].length == longest[1].length)
                return !current[2] && longest[2] ? current : longest
            return longest
        });
    }
    function possible() {
        const candidates: [keyof Lx, string, boolean][] = [];
        Object.entries(lexicon).map(([name, rule]) => {
            if (typeof rule == "function") {
                const text = rule(source.substring(idx), reporter, line, column);
                if (text !== undefined) candidates.push([name, text, false]);
            } else if (typeof rule != "string") {
                const dynamic = rule.source[rule.source.length - 1] == '*'
                const regex = new RegExp(`^${rule.source}`, rule.flags);
                const match = regex.exec(source.substring(idx));
                if (match) return candidates.push([name, match[0], dynamic]);
            } else if (source.substring(idx, idx + rule.length) == rule) {
                return candidates.push([name, rule, false]);
            }
        });
        return candidates;
    }
}

export const Tokens = {
    STRINGS: {
        STD: stringScanner
    },
    COMMENTS: {
        SHEBANG: /\#\!\/usr\/bin\/env\s.*/,
        DOUBLE_SLASH: /\/\/.*/,
        C_STYLE: cStyleCommentScanner,
    },
    SPACE: {
        ALL: /\s+/,
    }
}

function cStyleCommentScanner(value: string, reporter: Lib.Reporter, line: number, column: number) {
    const tokenizer = new TokenStream(value, {
        OPEN: "/*",
        CLOSE: "*/",
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    }, reporter, line, column);
    const opener = tokenizer.take();
    if (opener && opener.name == "OPEN") {
        let stack = 0,
            closer: Lib.Token | undefined,
            text = opener.text;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == "OPEN") stack += 1;
            else if (closer.name == "CLOSE") {
                if (!stack) return text;
                else stack -= 1;
            }
        }
        reporter.error(opener, `Unclosed comment at line ${opener.pos.line}, column ${opener.pos.column}.`);
        return text;
    }
}

function stringScanner(value: string, reporter: Lib.Reporter, line: number, column: number) {
    const tokenizer = new Lib.TokenStream(value, {
        SINGLE: "'",
        DOUBLE: '"',
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    }, reporter, line, column);
    const opener = tokenizer.take();
    if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
        let { text } = opener,
            closer: Lib.Token | undefined;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == opener.name) return text;
        }
        reporter.error(opener, `Unclosed string at line ${opener.pos.line}, column ${opener.pos.column}.`);
        return text;
    }
}
