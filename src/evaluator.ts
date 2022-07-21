import * as Ast from "./ast";
import * as Runtime from './runtime'
import { TOKEN } from "./scanner";

type Result = string | number | boolean | undefined
export class Evaluator extends Ast.Visitor<Result> {
    private env = new Runtime.Environment()

    Program(program: Ast.Program): Result {
        const statements = program.declarations.map(stmt => this.visit(stmt))
        if (!statements.length) return Runtime.lit(undefined)
        return Runtime.lit(statements[statements.length - 1])
    }
    PrintStatement(statement: Ast.PrintStatement): void {
        console.log(Runtime.lit(this.visit(statement.expr)))
    }
    VarDeclaration(declaration: Ast.VarDeclaration): void {
        this.env.init(declaration.ident.text)
        const val = declaration.expr ? this.visit(declaration.expr) : undefined
        this.env.set(declaration.ident.text, val)
    }
    ExpressionStatement(statement: Ast.ExpressionStatement): void {
        this.visit(statement.expr)
    }
    IfStatement(statement: Ast.IfStatement): void {
        const condition = this.visit(statement.condition);
        if (Runtime.truthy(condition)) this.visit(statement.trueStatement);
        else if (statement.falseStatement) this.visit(statement.falseStatement);
    }
    WhileStatement(statement: Ast.WhileStatement): void {
        while (Runtime.truthy(this.visit(statement.condition))) {
            try {
                this.visit(statement.body)
            } catch (e) {
                if (e instanceof Runtime.JumpException) {
                    if (e.distance > 1) {
                        e.distance -= 1
                        throw e
                    }
                    if (e instanceof Runtime.ContinueException) continue
                    if (e instanceof Runtime.BreakException) break
                }
            }
        }
    }
    JumpStatement(statement: Ast.JumpStatement): void {
        const jump = statement.destination.name == TOKEN.BREAK ?
            new Runtime.BreakException() : new Runtime.ContinueException()
        jump.distance = Runtime.number(this.visit(statement.distance || new Ast.Literal(1)))
        throw jump
    }
    Literal(expr: Ast.Literal): Result {
        return expr.value
    }
    Logical(expr: Ast.Logical): Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left)
        const left_truthy = Runtime.truthy(left)
        if (op == TOKEN.OR && left_truthy) return left
        if (op == TOKEN.AND && !left_truthy) return left
        const right = this.visit(expr.right)
        if (Runtime.truthy(right)) return right
        return Runtime.truthy(false)
    }
    Variable(expr: Ast.Variable): Result {
        return this.env.get(expr.name.text)
    }
    Assign(assign: Ast.Assign): Result {
        this.env.set(assign.name.text, this.visit(assign.expr))
        return this.env.get(assign.name.text)
    }
    Unary(expr: Ast.Unary): Result {
        const { operator: { name: op } } = expr
        const value = this.visit(expr.operand);
        if (op == TOKEN.BANG) return !Runtime.truthy(value);
        if (op == TOKEN.DASH) return -Runtime.number(value);
        throw new Runtime.RuntimeError("Unexpected unary expression")
    }
    Binary(expr: Ast.Binary): Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left);
        const right = this.visit(expr.right);
        if (typeof left == 'string' || typeof right == 'string' && op == TOKEN.PLUS)
            return `${left}${right}`
        if (op == TOKEN.COMMA) return right;
        if (op == TOKEN.PLUS) return Runtime.number(left) + Runtime.number(right);
        if (op == TOKEN.DASH) return Runtime.number(left) - Runtime.number(right);
        if (op == TOKEN.STAR) return Runtime.number(left) * Runtime.number(right);
        if (op == TOKEN.SLASH) return Runtime.number(left) / Runtime.number(right);
        if (op == TOKEN.GREATER) return Runtime.number(left) > Runtime.number(right);
        if (op == TOKEN.GREATER_EQUAL) return Runtime.number(left) >= Runtime.number(right);
        if (op == TOKEN.LESS) return Runtime.number(left) < Runtime.number(right);
        if (op == TOKEN.LESS_EQUAL) return Runtime.number(left) <= Runtime.number(right);
        throw new Runtime.RuntimeError("Unexpected binary expression")
    }
    Ternary(expr: Ast.Ternary): Result {
        const { op1: { name: op1 }, op2: { name: op2 } } = expr
        if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
            const left = this.visit(expr.left);
            if (Runtime.truthy(left)) return this.visit(expr.middle);
            return this.visit(expr.right);
        }
        throw new Runtime.RuntimeError("Unexpected ternary expression")
    }
    Grouping(expr: Ast.Grouping): Result {
        return this.visit(expr.inner);
    }
    Block(block: Ast.Block): void {
        const previous = this.env
        this.env = new Runtime.Environment(previous)
        try {
            block.statements.map(stmt => this.visit(stmt))
        } finally {
            this.env = previous
        }
    }
}
