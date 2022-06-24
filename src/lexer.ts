export const lexicon = {
    leftArrow: { name: 'leftArrow', text: '<-' },
    rightFatArrow: { name: 'rightFatArrow', text: '=>' },
    doubleSquirt: { name: 'doubleSquirt', text: '~~' },
    colon: { name: 'colon', text: ':' },
    dot: { name: 'dot', text: '.' },
    equal: { name: 'equal', text: '=' },
    leftAngle: { name: 'leftAngle', text: '<' },
    leftParen: { name: 'leftParen', text: '(' },
    minus: { name: 'minus', text: '-' },
    plus: { name: 'plus', text: '+' },
    pound: { name: 'pound', text: '#' },
    question: { name: 'question', text: '?' },
    rightAngle: { name: 'rightAngle', text: '>' },
    rightParen: { name: 'rightParen', text: ')' },
    slash: { name: 'slash', text: '/' },
    star: { name: 'star', text: '*' },
    endOfInput: { name: 'endOfInput', text: '' },
    identifier: { name: 'identifier', text: '', regex: /[a-z][a-z\d]*/i },
    digits: { name: 'digits', text: '', regex: /\d+/ },
    space: { name: 'space', text: '', regex: /\s+/ },
    comment: { name: 'comment', text: '', regex: /;;.*/ },
    invalid: { name: 'invalid', text: '', regex: /./ },
} as const

export type Lexeme = ReturnType<typeof make>
type Regex = Lexeme & { name: 'identifier' | 'digits' | 'space' | 'comment' }

export function make<K extends keyof typeof lexicon>(
    name: K,
    text: string = lexicon[name].text
) {
    return { ...lexicon[name], text }
}

function isRegex(lexeme: Lexeme): lexeme is Regex {
    switch (lexeme.name) {
        case 'identifier':
        case 'digits':
        case 'space':
        case 'comment':
        case 'invalid': return true
        default: return false
    }
}


export function lex(text: string) {
    const lexemes: Lexeme[] = []
    let idx = 0
    lex()
    return lexemes

    function lex() {
        while (idx < text.length) {
            const lexeme = longest(possible())
            lexemes.push(lexeme)
            idx += lexeme.text.length
        }
        return lexemes.push(make('endOfInput'))
    }

    function longest(lexemes: Lexeme[]) {
        return lexemes.reduce((longest, current) =>
            current.text!.length > longest.text!.length ? current : longest)
    }

    function possible(): Lexeme[] {
        const names = Object.keys(lexicon) as (keyof typeof lexicon)[]
        const lexemes: Lexeme[] = []
        names.forEach((name: keyof typeof lexicon) => {
            const lexeme = lexicon[name]
            if (isRegex(lexeme)) {
                const regex = new RegExp(`^${lexeme.regex.source}`, lexeme.regex.flags)
                const match = regex.exec(text.substring(idx))
                if (match) {
                    return lexemes.push(make(name, match[0]))
                }
            }
            else if (text.substring(idx, idx + lexeme.text.length) == lexeme.text) {
                return lexemes.push(make(name))
            }
        })
        return lexemes
    }
}
