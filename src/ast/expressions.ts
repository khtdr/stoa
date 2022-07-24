import * as Ast from '../ast'

export class FunctionExpr implements Ast.Expression {
    constructor(
        readonly params: Ast.Token<"IDENTIFIER">[],
        readonly block: Ast.BlockStmt
    ) { }
}

export class LiteralExpr implements Ast.Expression {
    constructor(
        readonly value: string | [number, number] | boolean | undefined
    ) { }
    toString() {
        if (this.value === true || this.value === false) return `${this.value}`
        if (this.value === undefined) return 'nil'
        if (typeof this.value == 'string') return this.value
        const [val, prec] = this.value
        return `${val.toFixed(prec)}`
    }
}

export class VariableExpr implements Ast.Expression {
    constructor(
        readonly name: Ast.Token<"IDENTIFIER">
    ) { }
}

export class UnaryExpr implements Ast.Expression {
    constructor(
        readonly operator: Ast.Token<any>,
        readonly operand: Ast.Expression
    ) { }
}

export class CallExpr implements Ast.Expression {
    constructor(
        readonly callee: Ast.Expression,
        readonly args: Ast.Expression[],
        readonly end: Ast.Token<any>,
    ) { }
}

export class BinaryExpr implements Ast.Expression {
    constructor(
        readonly left: Ast.Expression,
        readonly operator: Ast.Token<any>,
        readonly right: Ast.Expression
    ) { }
}


export class AssignExpr implements Ast.Expression {
    constructor(
        readonly name: Ast.Token<'IDENTIFIER'>,
        readonly expr: Ast.Expression
    ) { }
}

export class LogicalExpr implements Ast.Expression {
    constructor(
        readonly left: Ast.Expression,
        readonly operator: Ast.Token<any>,
        readonly right: Ast.Expression
    ) { }
}

export class TernaryExpr implements Ast.Expression {
    constructor(
        readonly left: Ast.Expression,
        readonly op1: Ast.Token<any>,
        readonly middle: Ast.Expression,
        readonly op2: Ast.Token<any>,
        readonly right: Ast.Expression
    ) { }
}

export class GroupExpr implements Ast.Expression {
    constructor(
        readonly inner: Ast.Expression
    ) { }
}
