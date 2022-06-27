import { Lexicon, Token, TokenStream } from "./tokenizer"

export class Parser<T extends Lexicon, K> {
    tokens: Token<keyof T>[]
    current = 0
    constructor(stream: TokenStream<T>) {
        this.tokens = stream.drain()
    }
    parse(): K { return this.tokens as unknown as K }

    match(...names: string[]): boolean {
        for (const name of names) {
            if (this.check(name)) {
                this.advance()
                return true
            }
        }
        return false
    }

    check(name: string): boolean {
        return this.peek()?.name == name
    }

    atEnd(): boolean {
        return !this.peek().name
    }

    advance(): Token<keyof T> {
        if (!this.atEnd()) this.current++
        return this.previous()
    }

    peek(): Token<keyof T> {
        return this.tokens[this.current]
    }

    previous(): Token<keyof T> {
        return this.tokens[this.current - 1]
    }

    consume(name: string, message: string) {
        if (this.check(name)) this.advance()
        else throw `Error: ${this.peek()} ${message}`
    }
}
