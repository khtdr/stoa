// Keyword tokens
type Keyword = keyof typeof Keywords
const Keywords = {
    // sorted by Value length
    'def':      'def',
    'for':      'for',
    'if':       'if',
    'forward':  '->',
    'backward': '<-',
    'lparen':   '(',
    'rparen':   ')',
    'less':     '<',
    'greater':  '>',
    'equals':   '=',
    'plus':     '+',
    'dash':     '-',
    'slash':    '/',
    'star':     '*',
}

// Regular Expression tokens
type Regex = keyof typeof Regexes
const Regexes = {
    'number':     /^\d+/,
    'variable':   /^\w[\w\d]*/,
    'whitespace': /^\s+/,
}

// Lexer class: new Lexer('program_text').tokenize()
export class Lexer {

    constructor (readonly text :string) {}

    tokenize() {
        const tokens :Token[] = []
        const take = this.tokenTaker()
        let idx = 0
        while (idx < this.text.length) {
            const token = this.longestToken(this.possibleTokens(idx))
            if (!token) {
                throw JSON.stringify(take({
                    kind: 'invalid-input',
                    text: this.text.substr(idx, 1)
                }))
            }
            tokens.push(take(token))
            idx += token.text.length
        }
        return tokens.filter(token => token.kind != 'whitespace')
    }

    tokenTaker() {
        let column = 1
        let line = 1
        return (token :Token) => {
            token.col = column
            token.line = line
            const lines = token.text.split("\n").length
            if (lines > 1) {
                line += lines - 1
                column = token.text.length - token.text.lastIndexOf("\n")
            } else column += token.text.length
            return token
        }
    }

    possibleTokens(idx :number) {
        const keywordToken = (kind :Keyword) => {
            const text = this.text.substr(idx, Keywords[kind].length)
            if (text == Keywords[kind]) return {kind, text}
        }
        const regexToken = (kind :Regex) => {
            const match = this.text.substr(idx).match(Regexes[kind])
            if (match) return {kind, text:match[0]}
        }
        const keywords = Object.keys(Keywords) as Keyword[]
        const regexes = Object.keys(Regexes) as Regex[]
        return [
            ...keywords.map(kind => keywordToken(kind)),
            ...regexes.map(kind => regexToken(kind)),
        ].filter(t=>t) as Token[]
    }

    longestToken(tokens :Token[]) {
        if (!tokens.length) return null
        return tokens.reduce((longest, current) =>
            current.text.length > longest.text.length ? current : longest)
    }
}


export type Token = {
    kind  :Keyword|Regex|'invalid-input'
    text  :string
    line? :number
    col?  :number
}
