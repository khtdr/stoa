import * as Lib from ".";

export type Lexeme =
    | string
    | RegExp
    | ((
        text: string,
        reporter: Lib.Reporter,
        line: number,
        column: number
    ) => undefined | string);
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
        readonly reporter: Lib.Reporter,
        line = 1,
        column = 1
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
        let token,
            tokens = [];
        while ((token = this.take())) tokens.push(token);
        return tokens;
    }
    print(tokens = this.buffer, level: "error" | "log" = "log") {
        console[level](tokens.map((t) => `${t}`).join("\n"));
    }

    private eof = false;
    private next(): Token<keyof Lx> | undefined {
        while (true) {
            if (this.eof) return;
            const token = this.generator.next().value;
            if (!token) {
                this.eof = true;
                continue;
            }
            if (token.name == ERROR_TOKEN) {
                this.reporter.error(token, `Unrecognized input`);
                continue;
            }
            if (token.name.toString().startsWith("_")) {
                continue;
            }
            return token;
        }
    }
}

export class TokenStreamClass<Lx extends Lexicon> extends TokenStream<Lx> {
    constructor(source: string, reporter: Lib.Reporter) {
        super(source, {} as Lx, reporter);
    }
}

function* tokenGenerator<Lx extends Lexicon>(
    source: string,
    lexicon: Lx,
    reporter: Lib.Reporter,
    start_line: number,
    start_column: number
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
            if (current[1].length > longest[1].length) return current;
            if (current[1].length == longest[1].length)
                return !current[2] && longest[2] ? current : longest;
            return longest;
        });
    }
    function possible() {
        const candidates: [keyof Lx, string, boolean][] = [];
        Object.entries(lexicon).map(([name, rule]) => {
            if (typeof rule == "function") {
                const text = rule(source.substring(idx), reporter, line, column);
                if (text !== undefined) candidates.push([name, text, false]);
            } else if (typeof rule != "string") {
                const dynamic = rule.source[rule.source.length - 1] == "*";
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
        STD: stringScanner,
    },
    COMMENTS: {
        SHEBANG: /\#\!\/usr\/bin\/env\s.*/,
        DOUBLE_SLASH: /\/\/.*/,
        C_STYLE: cStyleCommentScanner,
    },
    SPACE: {
        ALL: /\s+/,
    },
};

function cStyleCommentScanner(
    value: string,
    reporter: Lib.Reporter,
    line: number,
    column: number
) {
    const tokenizer = new TokenStream(
        value,
        {
            OPEN: "/*",
            CLOSE: "*/",
            ESCAPED_CHAR: /\\./,
            CHAR: /.|\s/,
        },
        reporter,
        line,
        column
    );
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
        reporter.error(opener, `Unclosed comment`);
        return text;
    }
}

function stringScanner(
    value: string,
    reporter: Lib.Reporter,
    line: number,
    column: number
) {
    const tokenizer = new Lib.TokenStream(
        value,
        {
            SINGLE: "'",
            DOUBLE: '"',
            ESCAPED_CHAR: /\\./,
            CHAR: /.|\s/,
        },
        reporter,
        line,
        column
    );
    const opener = tokenizer.take();
    if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
        let { text } = opener,
            closer: Lib.Token | undefined;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == opener.name) return text;
        }
        reporter.error(opener, `Unclosed string, expected ${opener.text}`);
        return text;
    }
}
