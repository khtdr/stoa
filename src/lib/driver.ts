export const driver = undefined
// import * as Lib from ".";

// export class Driver<Lx extends Lib.Lexicon, Ast extends object> {
//     status = 0;
//     constructor(
//         readonly lang: Lib.Language<Lx, Ast>,
//         readonly treewalker: Lib.Visitor<Ast, string>
//     ) { }

//     run(source: string) {
//         try {
//             const tokens = this.lang.scan(source);
//             if (!tokens) throw new Error('failed to tokenize')

//             const ast = this.lang.parse(tokens);
//             if (!ast) throw new Error('failed to parse')

//             const result = this.treewalker.visit(ast)
//             return { tokens, result }
//         } catch (e) {
//             console.warn(e)
//         } finally {
//             return { tokens: [], result: undefined }
//         }
//     }
// }