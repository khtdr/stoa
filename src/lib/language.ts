export const langauge = undefined
// import * as Lib from '.'

// export class Language<Lex extends Lib.Lexicon, Ast extends object> {

//     details: Params<Lex, Ast>['details']
//     frontend: Params<Lex, Ast>['frontend']

//     constructor(
//         details: Partial<Params<Lex, Ast>['details']> = {},
//         frontend: Partial<Params<Lex, Ast>['frontend']> = {},
//     ) {
//         this.details = {
//             ...details,
//             name: details.name ?? 'nameless-lang',
//             version: details.version ?? '0.0.experimental'
//         }
//         this.frontend = {
//             Scanner: frontend.Scanner ||
//                 // @ts-expect-error not using this
//                 Lib.TokenStreamClassFactory.buildTokenStreamClass({ CHAR: /./ }),
//             Parser: frontend.Parser || Lib.AnyTokenParser<Lex, Ast>,
//         }
//     }

//     scan(source: string): Lib.Token<keyof Lex>[] {
//         return new this.frontend.Scanner(source, {}, new Lib.StdReporter()).drain()
//     }

//     parse(tokens: Lib.Token<keyof Lex>[]): Ast | undefined {
//         return new this.frontend.Parser(tokens).parse()
//     }
// }

// type Params<Lex extends Lib.Lexicon, Ast extends object> = {
//     details: {
//         name: string
//         version: string
//         [attr: string]: string
//     }
//     frontend: {
//         Scanner: typeof Lib.TokenStream<Lex>
//         // Parser: new (tokens: Lib.Token<keyof Lex>[]) => Lib.Parser<Lex, Ast>
//         Parser: typeof Lib.Parser<Lex, Ast>
//     }
// }
