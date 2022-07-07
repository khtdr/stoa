import { LoxVisitor, Literal, Unary, Grouping, Binary } from './ast-builder'
export class LoxPrettyPrinter implements LoxVisitor<string> {
    Literal(expr: Literal) { return JSON.stringify(expr.value) }
    Unary(expr: Unary) { return `(${expr.operator.text} ${expr.right.accept(this)})` }
    Binary(expr: Binary) { return `(${expr.operator.text} ${expr.left.accept(this)} ${expr.right.accept(this)})` }
    Grouping(expr: Grouping) { return `${expr.inner.accept(this)}` }
}
