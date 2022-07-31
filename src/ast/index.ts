// Any node that can be visited by a parser, printer, resolver, etc.
export interface Visitable { }

// Nodes that setup side effects
export interface Declarable extends Visitable { }

// Nodes that runtime side effects
export interface Statement extends Visitable { }

// Nodes that can be expressed as a value
export interface Expression extends Visitable { }

// usually identifiers and references for static analysis
export { TOKEN } from '../tokenizer'
export type { Token } from '../tokenizer'

// organized implementations
export * from './declarations'
export * from './expressions'
export * from './statements'
export * from './visitor'

export class Program implements Visitable {
    constructor(
        readonly code: Visitable[]
    ) { }
}
