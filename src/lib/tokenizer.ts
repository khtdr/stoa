export type Lexeme = string | RegExp | ((text: string) => undefined | string)
export type Lexer = Lexeme | [Lexeme, (text: string) => unknown]
export type Dict = Record<string, Lexer>

export class Token<Name = string> {
    constructor(
        readonly name: Name,
        readonly text: string,
        readonly value: unknown,
        readonly pos: { line: number; column: number },
    ) { }
    toString() { return JSON.stringify(this) }
}

export class Tokenizer<T extends Dict = {}> {

    constructor(
        private readonly dict: T,
        private readonly source: string,
    ) { }

    private _tokens: Token<keyof T>[] = []
    get tokens(): typeof this._tokens {
        if (!this._tokens.length) this.scan()
        return this._tokens;
    }

    private idx = 0
    private line = 1
    private column = 1
    private scan() {
        this.idx = 0;
        this.line = 1
        this.column = 1
        while (this.idx < this.source.length) {
            const [name, text = this.source[this.idx], value] = this.longest(this.possible())
            if (!name) this._tokens.push(this.error(text))
            else this._tokens.push(new Token(name, text, value, this.pos()))

            const lines = text.split("\n").length
            if (lines > 1) {
                this.line += lines - 1
                this.column = text.length - text.lastIndexOf("\n")
            }
            else this.column += text.length
            this.idx += text.length
        }
    }

    public errors?: Token[]
    private error(text: string) {
        this.errors = this.errors || []
        const token = new Token('_stoa_::error', text, undefined, this.pos())
        this.errors.push(token)
        return token
    }

    private pos() {
        return { line: this.line, column: this.column }
    }

    private longest(candidates: Array<[keyof T, string, unknown]>) {
        if (!candidates.length) return []
        return candidates.reduce((longest, current) =>
            current[1]!.length > longest[1]!.length ? current : longest)
    }

    private possible() {
        const candidates: Array<[keyof T, string, unknown]> = [];
        Object.entries(this.dict).map(([name, rule]) => {
            const [lexeme, valueFn = (val: string) => val] = Array.isArray(rule) ? rule : [rule]
            if (typeof lexeme == 'function') {
                const text = lexeme(this.source.substring(this.idx))
                if (text) candidates.push([name, text, valueFn(text)])

            } else if (typeof lexeme != 'string') {
                const regex = new RegExp(`^${lexeme.source}`, lexeme.flags)
                const match = regex.exec(this.source.substring(this.idx))
                if (match) return candidates.push([name, match[0], valueFn(match[0])])

            } else if (this.source.substring(this.idx, this.idx + lexeme.length) == rule) {
                return candidates.push([name, lexeme, valueFn(lexeme)])
            }
        })
        return candidates
    }
}


class BaseTokenizerClass<T extends Dict = {}> extends Tokenizer<T> {
    constructor(source: string) { super({} as T, source) }
}
export type TokenizerClass<T extends Dict = {}> = typeof BaseTokenizerClass<T>

export class TokenizerClassFactory {
    static build<T extends Dict>(dict: T): TokenizerClass<T> {
        class TokenizerClassFactoryClass extends Tokenizer<T> {
            constructor(source: string) {
                super(dict, source)
            }
        }
        return TokenizerClassFactoryClass
    }
}
