import { Language, Lexicon, Visitable } from '.'

const STAGE = {
    Tokens: 'Tokens',
    ParseTree: 'ParseTree',
    Evaluate: 'Evaluate',
}

type Stage = keyof typeof STAGE

export class Driver<Lx extends Lexicon, Ast extends Visitable> {
    status = 0
    constructor(
        readonly lang: Language<Lx, Ast>,
        readonly stage: Stage = 'Evaluate'
    ) { }

    run(source: string) {
        const stream = this.lang.scan(source)
        if (this.stage == STAGE.Tokens)
            return this.lang.tokenize(stream)

        const ast = this.lang.parse(stream)
        if (this.stage == STAGE.ParseTree)
            return this.lang.print(ast)

        return this.lang.evaluate(ast)
    }
}
