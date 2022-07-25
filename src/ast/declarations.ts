import * as Ast from '../ast'

export class VariableDecl implements Ast.Declarable {
    constructor(
        readonly name: Ast.Token<"IDENTIFIER">,
        readonly expr: Ast.Expression | undefined
    ) { }
}

export class FunctionDecl implements Ast.Declarable {
    constructor(
        readonly name: Ast.Token<"IDENTIFIER">,
        readonly func: Ast.FunctionExpr,
    ) { }
}
