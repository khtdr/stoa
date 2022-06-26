import { Cli, LanguageFactory, TokenizerClassFactory } from './lib'
import { version } from '../package.json'

const APP = { name: 'stoa', version }

const StringTokenizer = TokenizerClassFactory.build({
    SINGLE: "'",
    DOUBLE: '"',
    ESCAPED_CHAR: /\\./,
    CHAR: /./,
} as const)

function isString(value: string) {
    const tokenizer = new StringTokenizer(value)
    const [first] = tokenizer.tokens
    if (!["SINGLE", "DOUBLE"].includes(first?.name)) return undefined

    let text = first.text, i = 1
    while (true) {
        const next = tokenizer.tokens[i++]
        if (!next) return undefined

        text += next.text
        if (next.name == first.name) return text
    }
}

const STOA = LanguageFactory.build({
    TokenizerClass: TokenizerClassFactory.build({
        LEFT_ARROW: '<-',
        RIGHT_FAT_ARROW: '=>',
        DOUBLE_SQUIRT: '~~',
        COLON: ':',
        DOT: '.',
        EQUAL: '=',
        LEFT_ANGLE: '<',
        LEFT_PAREN: '(',
        MINUS: '-',
        PLUS: '+',
        POUND: '#',
        QUESTION: '?',
        RIGHT_ANGLE: '>',
        RIGHT_PAREN: ')',
        SLASH: '/',
        STAR: '*',
        IDENTIFIER: /[a-z][a-z\d]*/i,
        DIGITS: [/\d+/, (text: string) => parseInt(text, 10)],
        SPACE: /\s+/,
        COMMENT: [/;;.*/, (text: string) => text.substring(2).trim()],
        STRING: [isString, (text: string) => text.substring(1, text.length - 1)],
    })
})

new Cli(APP).run(STOA.driver)
