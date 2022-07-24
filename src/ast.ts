// Any node that can be visited by a parser, printer, resolver, etc.
export interface Visitable { }

// Nodes that setup side effects
export interface Declarable extends Visitable { }

// Nodes that runtime side effects
export interface Statement extends Visitable { }

// Nodes that can be expressed as a value
export interface Expression extends Visitable { }

// usually identifiers and references for static analysis
export { TOKEN } from './scanner'
export type { Token } from './scanner'

// organized implementations
export * from './ast/declarations'
export * from './ast/expressions'
export * from './ast/statements'
export * from './ast/visitor'

export class Program implements Visitable {
    constructor(
        readonly code: Visitable[]
    ) { }
}
