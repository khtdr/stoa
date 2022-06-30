import { Parser } from "./parser"
import { Lexicon, TokenStream } from "./tokenizer"

export class Language<
    T extends Lexicon,
    K extends { accept(treewalker: any): any }
    > {
    readonly engine: Engine<T, K>
    readonly driver: Driver<T, K>

    constructor(
        TokenizerClass: typeof TokenStream,
        ParserClass: typeof Parser,
        EvaluatorClass: new () => void,
    ) {
        this.engine = new Engine(TokenizerClass, ParserClass, EvaluatorClass)
        this.driver = new Driver(this.engine)
    }
}

class Engine<T extends Lexicon, K extends { accept(treewalker: any): any }> {
    constructor(
        private readonly TokenizerClass: typeof TokenStream,
        private readonly ParserClass: typeof Parser,
        private readonly EvaluatorClass: new () => void
    ) { }
    tokenize(source: string): TokenStream<T> {
        return new this.TokenizerClass<T>(source)
    }
    parse(source: string): K {
        const stream = this.tokenize(source)
        return new this.ParserClass<T, K>(stream).parse()
    }
    evaluate(source: string) {
        const ast = this.parse(source)
        const evaluator = new this.EvaluatorClass()
        return ast.accept(evaluator)
    }
}

class Driver<T extends Lexicon, K extends { accept(treewalker: any): any }> {
    constructor(
        private readonly engine: Engine<T, K>
    ) { }

    public status = 0
    public target: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'

    run(program: string) {
        return this.engine[this.target](program)
    }
}
