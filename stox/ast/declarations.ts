import * as Expr from './expressions'
import * as Node from './nodes'

export class ClassDecl implements Node.Declaration {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">,
        readonly funcs: FunctionDecl[],
    ) { }
}

export class FunctionDecl implements Node.Declaration {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">,
        readonly func: Expr.FunctionExpr,
    ) { }
}

export class VariableDecl implements Node.Declaration {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">,
        readonly expr: Node.Expression | undefined
    ) { }
}
