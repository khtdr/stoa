import { LoxVisitor, Literal, Unary, Grouping, Binary } from './ast-builder'

export class LoxEvaluator implements LoxVisitor<string | number | boolean> {
    Literal(expr: Literal) {
        return JSON.parse(JSON.stringify(expr.value))
    }
    Unary(expr: Unary) {
        const value = expr.right.accept(this)
        if (expr.operator.text == '!') return !value
        if (expr.operator.text == '-') return -value
        throw "Unexpected Unary Operator"
    }
    Binary(expr: Binary) {
        const left = expr.left.accept(this)
        const right = expr.right.accept(this)
        if (expr.operator.text == '+') return left + right
        if (expr.operator.text == '-') return left - right
        if (expr.operator.text == '*') return left * right
        if (expr.operator.text == '/') return left / right
        throw "Unexpected Binary Operator"
    }
    Grouping(expr: Grouping) { return expr.inner.accept(this) }
}
