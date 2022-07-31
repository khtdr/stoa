import * as Node from './nodes'

export class BlockStmt implements Node.Statement {
    constructor(
        readonly statements: Node.Statement[]
    ) { }
}

export class ExpressionStmt implements Node.Statement {
    constructor(
        readonly expr: Node.Expression
    ) { }
}

export class IfStmt implements Node.Statement {
    constructor(
        readonly condition: Node.Expression,
        readonly trueStatement: Node.Statement,
        readonly falseStatement?: Node.Statement
    ) { }
}

export class JumpStmt implements Node.Statement {
    constructor(
        readonly keyword: Node.Token<'BREAK' | 'CONTINUE'>,
        readonly distance: Node.Expression,
    ) { }
}

export class PrintStmt implements Node.Statement {
    constructor(
        readonly expr: Node.Expression
    ) { }
}

export class ReturnStmt implements Node.Statement {
    constructor(
        readonly expr: Node.Expression,
        readonly keyword: Node.Token<'RETURN'>
    ) { }
}

export class WhileStmt implements Node.Statement {
    constructor(
        readonly condition: Node.Expression,
        readonly body: Node.Statement
    ) { }
}
