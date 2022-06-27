import { Parser } from "./parser"
import { Lexicon, TokenStream } from "./tokenizer"

export class Language<T extends Lexicon = {}, K = any, O = string> {
    readonly engine: Engine<T, K, O>
    readonly driver: Driver

    constructor(
        TokenizerClass: typeof TokenStream<T>,
        ParserClass: typeof Parser<T, K>,
        EvaluatorClass: new () => O
    ) {
        this.engine = new Engine(TokenizerClass, ParserClass, EvaluatorClass)
        this.driver = new Driver(this.engine)
    }
}

class Driver {
    constructor(
        private readonly engine: Engine<any, any, any>
    ) { }

    public status = 0
    public target: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'

    run(program: string) {
        return this.engine[this.target](program)
    }
}

class Engine<T extends Lexicon, K, O> {
    constructor(
        private readonly TokenizerClass: typeof TokenStream<T>,
        private readonly ParserClass: typeof Parser<T, K>,
        private readonly EvaluatorClass: new () => O
    ) { }
    tokenize(source: string): TokenStream<T> {
        return new this.TokenizerClass(source)
    }
    parse(source: string): K {
        const stream = this.tokenize(source)
        return new this.ParserClass(stream).parse()
    }
    evaluate(source: string) {
        const ast = this.parse(source)
        const evaluator = new this.EvaluatorClass()
        // @ts-expect-error
        return ast.accept(evaluator)
    }
}
