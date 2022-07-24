import * as Ast from '../ast'

export class BlockStmt implements Ast.Statement {
    constructor(
        readonly statements: Ast.Statement[]
    ) { }
}

export class ExpressionStmt implements Ast.Statement {
    constructor(
        readonly expr: Ast.Expression
    ) { }
}

export class IfStmt implements Ast.Statement {
    constructor(
        readonly condition: Ast.Expression,
        readonly trueStatement: Ast.Statement,
        readonly falseStatement?: Ast.Statement
    ) { }
}

export class JumpStmt implements Ast.Statement {
    constructor(
        readonly destination: Ast.Token<'BREAK' | 'CONTINUE'>,
        readonly distance: Ast.Expression
    ) { }
}

export class PrintStmt implements Ast.Statement {
    constructor(
        readonly expr: Ast.Expression
    ) { }
}

export class ReturnStmt implements Ast.Statement {
    constructor(
        readonly expr: Ast.Expression
    ) { }
}

export class WhileStmt implements Ast.Statement {
    constructor(
        readonly condition: Ast.Expression,
        readonly body: Ast.Statement
    ) { }
}
