import * as Ast from './ast'

export class Printer extends Ast.Visitor<string> {
    Literal(expr: Ast.Literal): string {
        return JSON.stringify(expr.value)
    }
    Unary(expr: Ast.Unary): string {
        const operator = expr.operator.text
        const operand = this.visit(expr.operand)
        return `(${operator} ${operand})`
    }
    Binary(expr: Ast.Binary): string {
        const operator = expr.operator.text
        const left = this.visit(expr.left)
        const right = this.visit(expr.right)
        return `(${operator} ${left} ${right})`
    }
    Ternary(expr: Ast.Ternary): string {
        const left = this.visit(expr.left)
        const middle = this.visit(expr.middle)
        const right = this.visit(expr.right)
        return `(if ${left} ${middle} ${right})`
    }
    Grouping(expr: Ast.Grouping): string {
        const operand = this.visit(expr.inner)
        return `${operand}`
    }
}
