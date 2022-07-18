import * as Lib from './lib'

export interface AstNode { }

export interface Expression extends AstNode { }

export class Literal implements Expression {
    constructor(
        readonly value: string | number | boolean | undefined,
    ) { }
}

export class Unary implements Expression {
    constructor(
        readonly operator: Lib.Token<any>,
        readonly operand: Expression
    ) { }
}

export class Binary implements Expression {
    constructor(
        readonly left: Expression,
        readonly operator: Lib.Token<any>,
        readonly right: Expression
    ) { }
}

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

export abstract class Visitor<Result> extends Lib.Visitor<AstNode, Result> {
    abstract Literal(expr: Literal): Result
    abstract Unary(expr: Unary): Result
    abstract Binary(expr: Binary): Result
    abstract Ternary(expr: Ternary): Result
    abstract Grouping(expr: Grouping): Result
}
