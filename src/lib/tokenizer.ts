export type Lexeme = string | RegExp | ((text: string) => undefined | string)
export type Lexer = Lexeme | [Lexeme, (text: string) => unknown]
export type Lexicon = Record<string, Lexer>
const ERROR_TOKEN = '::error'


export class Token<Name = string> {
    constructor(
        readonly name: Name,
        readonly text: string,
        readonly value: unknown,
        readonly pos: { line: number; column: number },
    ) { }
    toString() {
        const pos = `[${this.pos.line},${this.pos.column}]`
        const value = this.text === this.value ? "" : `(${this.value})`
        return `${this.name}${value}${pos}`
    }
}


export class TokenStream<L5n extends Lexicon = {}> {
    private generator: Generator<Token<keyof L5n>>
    constructor(source: string, lexicon: L5n = {} as L5n) {
        this.generator = tokenGenerator(source, lexicon)
    }

    private buffer: Token<keyof L5n>[] = []
    take() {
        if (this.buffer.length) return this.buffer.shift()
        return this.next()
    }
    peek() {
        if (!this.buffer.length) this.buffer.push(this.next())
        return this.buffer[0]
    }
    drain(): Token<keyof L5n>[] {
        let token, tokens = []
        while (token = this.take()) tokens.push(token)
        return tokens
    }

    private next() {
        while (true) {
            const token = this.generator.next().value
            if (!token) break

            if (token.name.toString().startsWith('_')) continue
            if (token.name == ERROR_TOKEN) {
                this.error(token)
                continue
            }
            return token
        }
    }

    public errors?: { char: string; line: number; column: number }[]
    private error(token: Token<keyof L5n>) {
        this.errors = this.errors || []
        this.errors.push({ char: token.text, ...token.pos })
    }
}

export class TokenStreamClassFactory {
    static build<L5n extends Lexicon>(lexicon: L5n)
        : typeof TokenStream & { TOKENS: Record<keyof L5n, keyof L5n> } {
        const TOKENS = Object.keys(lexicon)
            .reduce((a, c) => (a[c as keyof L5n] = c, a), {} as Record<keyof L5n, keyof L5n>)
        class TokenStreamClassFactoryClass extends TokenStream {
            constructor(source: string) {
                super(source, lexicon)
            }
            static TOKENS = TOKENS
        }
        return TokenStreamClassFactoryClass
    }
}


function* tokenGenerator<L5n extends Lexicon>(
    source: string,
    lexicon: L5n
): Generator<Token<keyof L5n>> {
    let idx = 0, line = 1, column = 1
    while (idx < source.length) {
        const [
            name = ERROR_TOKEN,
            text = source[idx],
            value
        ] = longest(possible())
        const token = new Token(name, text, value, pos())

        const lines = text.split("\n").length
        if (lines > 1) {
            line += lines - 1
            column = text.length - text.lastIndexOf("\n")
        }
        else column += text.length
        idx += text.length
        yield token
    }

    function pos() {
        return { line: line, column: column }
    }
    function longest(candidates: Array<[keyof L5n, string, unknown]>) {
        if (!candidates.length) return []
        return candidates.reduce((longest, current) =>
            current[1]!.length > longest[1]!.length ? current : longest)
    }
    function possible() {
        const candidates: Array<[keyof L5n, string, unknown]> = [];
        Object.entries(lexicon).map(([name, rule]) => {
            const [lexeme, valueFn = (val: string) => val] = Array.isArray(rule) ? rule : [rule]
            if (typeof lexeme == 'function') {
                const text = lexeme(source.substring(idx))
                if (text) candidates.push([name, text, valueFn(text)])

            } else if (typeof lexeme != 'string') {
                const regex = new RegExp(`^${lexeme.source}`, lexeme.flags)
                const match = regex.exec(source.substring(idx))
                if (match) return candidates.push([name, match[0], valueFn(match[0])])

            } else if (source.substring(idx, idx + lexeme.length) == rule) {
                return candidates.push([name, lexeme, valueFn(lexeme)])
            }
        })
        return candidates
    }
}
