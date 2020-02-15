type leftArrow =     {name :'leftArrow',     text :'<-'}
type rightFatArrow = {name :'rightFatArrow', text :'=>'}
type colon =         {name :'colon',         text :':' }
type dot =           {name :'dot',           text :'.' }
type equal =         {name :'equal',         text :'=' }
type leftAngle =     {name :'leftAngle',     text :'<' }
type leftParen =     {name :'leftParen',     text :'(' }
type minus =         {name :'minus',         text :'-' }
type plus =          {name :'plus',          text :'+' }
type pound =         {name :'pound',         text :'#' }
type question =      {name :'question',      text :'?' }
type rightAngle =    {name :'rightAngle',    text :'>' }
type rightParen =    {name :'rightParen',    text :')' }
type slash =         {name :'slash',         text :'/' }
type star =          {name :'star',          text :'*' }
type endOfInput =    {name :'endOfInput',    text :''  }
type identifier =    {name :'identifier',    text :string, regex:RegExp}
type digits =        {name :'digits',        text :string, regex:RegExp}
type space =         {name :'space',         text :string, regex:RegExp}
type invalid =       {name :'invalid',       text :string, regex:RegExp}


export const lexicon = {
    leftArrow:     {name: 'leftArrow',     text: '<-'} as leftArrow,
    rightFatArrow: {name: 'rightFatArrow', text: '=>'} as rightFatArrow,
    colon:         {name: 'colon',         text: ':' } as colon,
    dot:           {name: 'dot',           text: '.' } as dot,
    equal:         {name: 'equal',         text: '=' } as equal,
    leftAngle:     {name: 'leftAngle',     text: '<' } as leftAngle,
    leftParen:     {name: 'leftParen',     text: '(' } as leftParen,
    minus:         {name: 'minus',         text: '-' } as minus,
    plus:          {name: 'plus',          text: '+' } as plus,
    pound:         {name: 'pound',         text: '#' } as pound,
    question:      {name: 'question',      text: '?' } as question,
    rightAngle:    {name: 'rightAngle',    text: '>' } as rightAngle,
    rightParen:    {name: 'rightParen',    text: ')' } as rightParen,
    slash:         {name: 'slash',         text: '/' } as slash,
    star:          {name: 'star',          text: '*' } as star,
    endOfInput:    {name: 'endOfInput',    text: ''  } as endOfInput,
    identifier:    {name: 'identifier',    text: '', regex: /^[a-z][a-z\d]*/i} as identifier,
    digits:        {name: 'digits',        text: '', regex: /^\d+/           } as digits,
    space:         {name: 'space',         text: '', regex: /^\s+/           } as space,
    invalid:       {name: 'invalid',       text: '', regex: /^./             } as invalid,}


export function lookup<K extends keyof typeof lexicon>(name :K, text? :string) {
    const lexeme = {...lexicon[name]}
    if (text) lexeme.text = text
    return lexeme}

export type Lexeme = ReturnType<typeof lookup>
type Regex = identifier|digits|space


function isRegex(lexeme :Lexeme) :lexeme is Regex {
    switch(lexeme.name) {
        case 'identifier':
        case 'digits':
        case 'space':
        case 'invalid': return true
        default: return false}}


export function lex(text :string) {

    const lexemes :Lexeme[] = []
    let idx = 0
    lex()
    return lexemes

    function lex() {
        while (idx < text.length) {
            let lexeme = longest(possible())
            lexemes.push(lexeme)
            if (lexeme.name == 'endOfInput') break
            idx += lexeme.text.length}
        return lexemes.push(lookup('endOfInput'))}

    function possible() :Lexeme[] {
        const names = Object.keys(lexicon) as (keyof typeof lexicon)[]
        const lexemes :Lexeme[] = []
        names.forEach((name :keyof typeof lexicon) => {
            const lexeme = lexicon[name]
            if (isRegex(lexeme)) {
                const match = text.substr(idx).match(lexeme.regex)
                if (match) {
                    return lexemes.push(lookup(name, match[0]))}}
            else if (text.substr(idx, lexeme.text.length) == lexeme.text) {
                return lexemes.push(lookup(name))}})
        return lexemes}

    function longest(lexemes :Lexeme[]) {
        return lexemes.reduce((longest, current) =>
            current.text!.length > longest.text!.length ? current : longest)}}
