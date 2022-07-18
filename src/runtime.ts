import * as Ast from "./ast";
import { TOKEN } from "./scanner";

// SKIPPED OVER
// - Runtime errors
// - Error handling in general

type Result = string | number | boolean
export class Evaluator extends Ast.Visitor<Result> {
    Literal(expr: Ast.Literal): Result {
        return JSON.parse(JSON.stringify(expr.value));
    }
    Unary(expr: Ast.Unary): Result {
        const { operator: { name: op } } = expr
        const value = this.visit(expr.operand);
        if (op == TOKEN.BANG) return !truthy(value);
        if (op == TOKEN.DASH) return -number(value);
        throw new RuntimeError("Unexpected unary expression")
    }
    Binary(expr: Ast.Binary): Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left);
        const right = this.visit(expr.right);
        if (typeof left == 'string' || typeof right == 'string' && op == TOKEN.PLUS)
            return `${left}${right}`
        if (op == TOKEN.COMMA) return right;
        if (op == TOKEN.PLUS) return number(left) + number(right);
        if (op == TOKEN.DASH) return number(left) - number(right);
        if (op == TOKEN.STAR) return number(left) * number(right);
        if (op == TOKEN.SLASH) return number(left) / number(right);
        if (op == TOKEN.GREATER) return number(left) > number(right);
        if (op == TOKEN.GREATER_EQUAL) return number(left) >= number(right);
        if (op == TOKEN.LESS) return number(left) < number(right);
        if (op == TOKEN.LESS_EQUAL) return number(left) <= number(right);
        if (op == TOKEN.AND) return truthy(left) && truthy(right);
        if (op == TOKEN.OR) return truthy(left) || truthy(right);
        throw new RuntimeError("Unexpected binary expression")
    }
    Ternary(expr: Ast.Ternary): Result {
        const { op1: { name: op1 }, op2: { name: op2 } } = expr
        if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
            const left = this.visit(expr.left);
            if (truthy(left)) return this.visit(expr.middle);
            return this.visit(expr.right);
        }
        throw new RuntimeError("Unexpected ternary expression")
    }
    Grouping(expr: Ast.Grouping): Result {
        return this.visit(expr.inner);
    }
}

function truthy(val: unknown) {
    return (val !== undefined && val !== false)
}

function number(val: unknown) {
    if (typeof val == 'number') return val
    return parseFloat(`${val}`)
}

class RuntimeError extends Error { }
