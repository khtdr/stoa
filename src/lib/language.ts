import { Lexicon, Parser, TokenStream, Visitable } from "."

export class Language<Lx extends Lexicon, Ast extends Visitable> {

    constructor(
        readonly details: { [key: string]: string; name: string; version: string },
        readonly Classes: {
            Tokenizer: typeof TokenStream
            Parser: new (stream: TokenStream<Lx>) => Parser<Lx, Ast>;
            PrettyPrinter: new () => void
            Evaluator: new () => void
        }
    ) { }

    scan(source: string): TokenStream<Lx> {
        return new this.Classes.Tokenizer(source)
    }

    tokenize(stream: TokenStream<Lx>): string {
        return stream.drain().map(t => `${t}`).join('\n')
    }

    parse(stream: TokenStream<Lx>): Ast | undefined {
        return new this.Classes.Parser(stream).parse()
    }

    print(ast?: Ast): string {
        if (!ast) return ''
        const printer = new this.Classes.PrettyPrinter()
        return ast.accept(printer)
    }

    evaluate(ast?: Ast): string | number | boolean | object | undefined {
        if (!ast) return undefined
        const evaluator = new this.Classes.Evaluator()
        return ast.accept(evaluator)
    }
}
