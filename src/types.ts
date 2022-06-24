
function Lexicon<T extends Lexicon>(rules: T) {
    return rules
}

type Lexicon = Record<string, string | RegExp | undefined>

const lexicon = Lexicon({
    EQUAL: '=',
    LESS_THAN: '<',
    DIGITS: /^\d+/,
} as const)

type Lexeme = string;

type Token = keyof typeof lexicon;


class Scanner {
    private readonly source: string
    private readonly tokens: Token[] = []

    constructor(source: string) {
        this.source = source;
    }
    toString() {
        return `${this.source} - ${this.tokens}`
    }
}
