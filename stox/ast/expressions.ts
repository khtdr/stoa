import { Instance } from '../runtime/classes'
import * as Node from './nodes'
import * as Stmt from './statements'

export class AssignExpr implements Node.Expression {
    constructor(
        readonly name: Node.Token<'IDENTIFIER'>,
        readonly value: Node.Expression
    ) { }
}

export class BinaryExpr implements Node.Expression {
    constructor(
        readonly left: Node.Expression,
        readonly operator: Node.Token,
        readonly right: Node.Expression
    ) { }
}

export class CallExpr implements Node.Expression {
    constructor(
        readonly callee: Node.Expression,
        readonly args: Node.Expression[],
        readonly end: Node.Token<any>,
    ) { }
}

export class FunctionExpr implements Node.Expression {
    constructor(
        readonly params: Node.Token<"IDENTIFIER">[],
        readonly block: Stmt.BlockStmt
    ) { }
}

export class GetExpr implements Node.Expression {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">,
        readonly expr: Node.Expression,
    ) { }
}

export class GroupExpr implements Node.Expression {
    constructor(
        readonly inner: Node.Expression
    ) { }
}

export class LiteralExpr implements Node.Expression {
    constructor(
        readonly value: string | [number, number] | boolean | undefined | void | Instance
    ) { }
    toString() {
        if (this.value instanceof Instance) return this.value.toString()
        if (this.value === true || this.value === false) return `${this.value}`
        if (this.value === undefined) return 'nil'
        if (typeof this.value == 'string') return this.value
        const [val, prec] = this.value
        return `${val.toFixed(prec)}`
    }
}

export class LogicalExpr implements Node.Expression {
    constructor(
        readonly left: Node.Expression,
        readonly operator: Node.Token<any>,
        readonly right: Node.Expression
    ) { }
}

export class SetExpr implements Node.Expression {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">,
        readonly expr: Node.Expression,
        readonly value: Node.Expression,
    ) { }
}

export class TernaryExpr implements Node.Expression {
    constructor(
        readonly left: Node.Expression,
        readonly op1: Node.Token<any>,
        readonly middle: Node.Expression,
        readonly op2: Node.Token<any>,
        readonly right: Node.Expression
    ) { }
}

export class ThisExpr implements Node.Expression {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">
    ) { }
}

export class UnaryExpr implements Node.Expression {
    constructor(
        readonly operator: Node.Token<any>,
        readonly operand: Node.Expression
    ) { }
}

export class VariableExpr implements Node.Expression {
    constructor(
        readonly name: Node.Token<"IDENTIFIER">
    ) { }
}
