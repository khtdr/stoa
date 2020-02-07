import { Token, Lexer } from './lexer'

enum NodeKind {
    'number'
}

interface BaseNode {
    kind    :NodeKind
    text    :string
    line?   :number
    column? :number
}

type Node = {
    kind :NodeKind.number
    value :number
}

export type Ast = BaseNode & Node

export class Parser {

    constructor(readonly tokens :Token[]) {}
    private i = 0

    take(kind :Token['kind']) {
        if (this.tokens[this.i] && this.tokens[this.i].kind == kind) {
            return this.tokens[this.i++]
        }
    }
    takeMany(kind :Token['kind']) {
        let token :Token|undefined
        const tokens :Token[] = []
        while (token = this.take(kind)) {
            tokens.push(token)
        }
        if (tokens.length) {
            return tokens
        }
    }

    parse() {
        return this.parseNumber()
    }

    parseNumber() {
        const tokens = this.takeMany('number')
        if (tokens) {
            const digits = tokens.reduce((a,c) => `${a}${c.text}`, '')
            return {
                kind: NodeKind.number,
                text: digits,
                value: parseInt(digits, 10),
                line: tokens[0].line,
                column: tokens[0].col,
            }
        }
    }
}
