import { Lexicon, Token, TokenStream } from "."

export type Visitable<Ast = any> = {
    accept(visitor: Ast): any
}

export class Parser<Lx extends Lexicon, Ast extends Visitable> {
    constructor(stream: TokenStream<Lx>) {
        this.tokens = stream.drain()
    }

    parse(): Ast | undefined { return undefined }

    private tokens: Token<keyof Lx>[]
    private current = 0

    protected match(...names: string[]): boolean {
        for (const name of names) {
            if (this.check(name)) {
                this.advance()
                return true
            }
        }
        return false
    }

    protected check(name: string): boolean {
        return this.peek()?.name == name
    }

    protected atEnd(): boolean {
        return !this.peek().name
    }

    protected advance(): Token<keyof Lx> {
        if (!this.atEnd()) this.current++
        return this.previous()
    }

    protected peek(): Token<keyof Lx> {
        return this.tokens[this.current]
    }

    protected previous(): Token<keyof Lx> {
        return this.tokens[this.current - 1]
    }

    protected consume(name: string, message: string) {
        if (this.check(name)) this.advance()
        else throw `Error: ${this.peek()} ${message}`
    }
}
