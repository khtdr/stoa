const STOA_DICT = {
    left_Arrow: '<-',
    right_fat_Arrow: '=>',
    double_squirt: '~~',
    colon: ':',
    dot: '.',
    equal: '=',
    left_angle: '<',
    left_paren: '(',
    minus: '-',
    plus: '+',
    pound: '#',
    question: '?',
    right_angle: '>',
    right_paren: ')',
    slash: '/',
    star: '*',
    identifier: /^[a-z][a-z\d]*/i,
    digits: /\d+/,
    space: /\s+/,
    comment: /;;.*/,
}

class ScannerBase<Dict extends Record<string, string | RegExp>> {
    constructor(
        public readonly dict: Dict,
        public readonly source: string,
    ) { }

    protected pos = 0;
    protected line = 1
    protected column = 1
    protected tokens: SToken<keyof Dict>[] = []

    scan() {
        this.pos = 0;
        this.line = 1
        this.column = 1
        this.tokens = [];
        while (this.pos < this.source.length) {
            const [name, lexeme, literal] = this.longest(this.possible())
            if (!name) {
                this.tokens.push(new SToken('invalid', this.source[this.pos], '', this.position()))
                return this.tokens;
            }

            this.tokens.push(new SToken(name, lexeme, literal, this.position()))
            const lines = lexeme.split("\n").length
            if (lines > 1) {
                this.line += lines - 1
                this.column = lexeme.length - lexeme.lastIndexOf("\n")
            }
            else this.column += lexeme.length
            this.pos += lexeme.length
        }
        this.tokens.push(new SToken('end_of_input', '', undefined, this.position()))
        return this.tokens;
    }

    protected position() { return { line: this.line, column: this.column } }


    protected longest(candidates: Array<[keyof Dict, string, unknown]>) {
        if (!candidates.length) return []
        return candidates.reduce((longest, current) =>
            current[1]!.length > longest[1]!.length ? current : longest)
    }

    protected possible() {
        const candidates: Array<[keyof Dict, string, unknown]> = [];
        Object.entries(this.dict).map(([name, rule]) => {
            if (typeof rule != 'string') {
                const regex = new RegExp(`^${rule.source}`, rule.flags)
                const match = regex.exec(this.source.substring(this.pos))
                if (match) {
                    return candidates.push([name, match[0], undefined])
                }
            }
            else if (this.source.substring(this.pos, this.pos + rule.length) == rule) {
                return candidates.push([name, rule, undefined])
            }
        })
        return candidates
    }
}

class SToken<Name> {
    constructor(
        readonly name: Name,
        readonly lexeme: string,
        readonly literal: unknown,
        readonly position: { line: number; column: number },
    ) { }

    toString() {
        return `${this.name} ${this.lexeme} ${this.literal}`
    }
}

class ScannerFactory {
    static build<Dict extends Record<string, string | RegExp>>(dict: Dict) {
        class DictScanner extends ScannerBase<Dict> {
            constructor(source: string) {
                super(dict, source);
            }
        }
        return DictScanner
    }
}

const StoaScanner = ScannerFactory.build(STOA_DICT);
const scanner = new StoaScanner('some source code!!')
console.log('scanner output:', scanner.scan())


// const STOA_LEXERS = Object.entries(STOA_DICT).map(([name, rule]) => ({ name }))

// export type Lexeme = ReturnType<typeof make>
// type Regex = Lexeme & { name: 'identifier' | 'digits' | 'space' | 'comment' }

// export function make<K extends keyof typeof lexicon>(
//     name: K,
//     text: string = lexicon[name].text
// ) {
//     return { ...lexicon[name], text }
// }

// function isRegex(lexeme: Lexeme): lexeme is Regex {
//     switch (lexeme.name) {
//         case 'identifier':
//         case 'digits':
//         case 'space':
//         case 'comment':
//         case 'invalid': return true
//         default: return false
//     }
// }


// export function lex(text: string) {
//     const lexemes: Lexeme[] = []
//     let idx = 0
//     lex()
//     return lexemes

//     function lex() {
//         while (idx < text.length) {
//             const lexeme = longest(possible())
//             lexemes.push(lexeme)
//             idx += lexeme.text.length
//         }
//         return lexemes.push(make('endOfInput'))
//     }

//     function longest(lexemes: Lexeme[]) {
//         return lexemes.reduce((longest, current) =>
//             current.text!.length > longest.text!.length ? current : longest)
//     }

//     function possible(): Lexeme[] {
//         const names = Object.keys(lexicon) as (keyof typeof lexicon)[]
//         const lexemes: Lexeme[] = []
//         names.forEach((name: keyof typeof lexicon) => {
//             const lexeme = lexicon[name]
//             if (isRegex(lexeme)) {
//                 const regex = new RegExp(`^${lexeme.regex.source}`, lexeme.regex.flags)
//                 const match = regex.exec(text.substring(idx))
//                 if (match) {
//                     return lexemes.push(make(name, match[0]))
//                 }
//             }
//             else if (text.substring(idx, idx + lexeme.text.length) == lexeme.text) {
//                 return lexemes.push(make(name))
//             }
//         })
//         return lexemes
//     }
// }


