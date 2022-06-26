import * as Tokenizer from './tokenizer'

export type Language = {
    engine: LanguageEngine;
    driver: LanguageDriver;
}

export class LanguageFactory {
    static build(args: { TokenizerClass: any }): Language {
        const engine = new LanguageEngine(args.TokenizerClass)
        const driver = new LanguageDriver(engine)
        return { engine, driver }
    }
}

export class LanguageDriver<T extends LanguageEngine = LanguageEngine> {

    constructor(
        private readonly lang: T,
    ) { }

    public status = 0
    public output: 'tokenize' | 'parse' | 'evaluate' = 'evaluate'
    public formatter: (output: any) => void = () => { }

    run(program: string): void {
        const value = this.lang[this.output](program)
        this.formatter(value)
    }
}

export class LanguageEngine {
    constructor(
        private readonly TokenizerClass: Tokenizer.TokenizerClass
    ) { }
    tokenize(source: string): Tokenizer.Token[] {
        return new this.TokenizerClass(source).tokens
    }
    parse(source: string) {
        return this.tokenize(source)
    }
    evaluate(source: string) {
        return this.tokenize(source)
    }
}
