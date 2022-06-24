import { Lexeme } from './lexer'

export type Position = { line: number, column: number }
export type Token<LEXEME extends Lexeme = Lexeme> = LEXEME & Position

export function tokenize(lexemes: Lexeme[],
    omit: Lexeme['name'][] = ['space', 'comment']) {
    const tokens: Token[] = []
    let column = 1
    let line = 1
    lexemes.forEach(lexeme => {
        const token = lexeme as (typeof lexeme) & Position
        token.column = column
        token.line = line
        if (token.name != 'endOfInput') {
            const lines = token.text.split("\n").length
            if (lines > 1) {
                line += lines - 1
                column = token.text.length - token.text.lastIndexOf("\n")
            }
            else column += token.text.length
        }
        tokens.push(token)
    })
    return tokens.filter(token => !omit.includes(token.name))
}
