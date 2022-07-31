// usually identifiers and references for static analysis
export { TOKEN } from '../tokenizer'
export type { Token } from '../tokenizer'

// Any node that can be visited by a parser, printer, resolver, etc.
export interface Ast { }

// Nodes that setup side effects
export interface Declaration extends Ast { }

// Nodes that runtime side effects
export interface Statement extends Ast { }

// Nodes that can be expressed as a value
export interface Expression extends Ast { }

// Root of AST
export class Program implements Ast {
    constructor(
        readonly code: Ast[]
    ) { }
}
