import * as Lib from './lib'

export abstract class Visitor<Result> extends Lib.Visitor<AstNode, Result> {
    abstract Assign(assign: Assign): Result
    abstract Binary(expr: Binary): Result
    abstract Block(block: Block): Result | void
    abstract Call(call: Call): Result
    abstract ExpressionStatement(statement: ExpressionStatement): Result | void
    abstract Function(fun: Function): Result | void
    abstract Grouping(expr: Grouping): Result
    abstract IfStatement(statement: IfStatement): Result | void
    abstract JumpStatement(statement: JumpStatement): Result | void
    abstract Literal(expr: Literal): Result
    abstract Logical(expr: Logical): Result
    abstract PrintStatement(statement: PrintStatement): Result | void
    abstract Program(program: Program): Result | void
    abstract ReturnStatement(ret: ReturnStatement): Result | void
    abstract Ternary(expr: Ternary): Result
    abstract Unary(expr: Unary): Result
    abstract VarDeclaration(declaration: VarDeclaration): Result | void
    abstract Variable(expr: Variable): Result
    abstract WhileStatement(statement: WhileStatement): Result | void
}


export interface AstNode { }
export interface Declaration extends AstNode { }
export interface Statement extends Declaration { }
export interface Expression extends AstNode { }

export class Program implements AstNode {
    constructor(
        readonly declarations: Declaration[]
    ) { }
}

export class VarDeclaration implements Declaration {
    constructor(
        readonly ident: Lib.Token<"IDENTIFIER">,
        readonly expr: Expression | undefined
    ) { }
}

export class Function implements Declaration {
    constructor(
        readonly ident: Lib.Token<"IDENTIFIER">,
        readonly params: Lib.Token<"IDENTIFIER">[],
        readonly block: Block
    ) { }
}

export class IfStatement implements Statement {
    constructor(
        readonly condition: Expression,
        readonly trueStatement: Statement,
        readonly falseStatement?: Statement
    ) { }
}

export class ReturnStatement implements Statement {
    constructor(
        readonly expr: Expression
    ) { }
}

export class JumpStatement implements Statement {
    constructor(
        readonly destination: Lib.Token<'BREAK' | 'CONTINUE'>,
        readonly distance: Expression
    ) { }
}

export class WhileStatement implements Statement {
    constructor(
        readonly condition: Expression,
        readonly body: Statement
    ) { }
}

export class ExpressionStatement implements Statement {
    constructor(
        readonly expr: Expression
    ) { }
}

export class PrintStatement implements Statement {
    constructor(
        readonly expr: Expression
    ) { }
}

export class Block implements Statement {
    constructor(
        readonly statements: Statement[]
    ) { }
}

export class Literal implements Expression {
    constructor(
        readonly value: string | number | boolean | undefined,
    ) { }
}

export class Variable implements Expression {
    constructor(
        readonly name: Lib.Token<"IDENTIFIER">
    ) { }
}

export class Unary implements Expression {
    constructor(
        readonly operator: Lib.Token<any>,
        readonly operand: Expression
    ) { }
}

export class Call implements Expression {
    constructor(
        readonly callee: Expression,
        readonly args: Expression[],
        readonly end: Lib.Token<any>,
    ) { }
}

export class Binary implements Expression {
    constructor(
        readonly left: Expression,
        readonly operator: Lib.Token<any>,
        readonly right: Expression
    ) { }
}


export class Assign implements Expression {
    constructor(
        readonly name: Lib.Token<'IDENTIFIER'>,
        readonly expr: Expression
    ) { }
}
export class Logical extends Binary { }

export class Ternary implements Expression {
    constructor(
        readonly left: Expression,
        readonly op1: Lib.Token<any>,
        readonly middle: Expression,
        readonly op2: Lib.Token<any>,
        readonly right: Expression
    ) { }
}

export class Grouping implements Expression {
    constructor(
        readonly inner: Expression
    ) { }
}
