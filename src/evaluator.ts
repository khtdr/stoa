import * as Ast from "./ast";
import * as Runtime from './runtime'
import { TOKEN } from "./scanner";

export class Evaluator extends Ast.Visitor<Runtime.Result> {
    readonly globals = new Runtime.Environment()
    private env = this.globals

    constructor() {
        super()
        this.globals.init("clock")
        this.globals.set("clock", {
            arity: 0, call() { return new Date().toLocaleString() }
        })
    }

    Program(program: Ast.Program): Runtime.Result {
        const statements = program.declarations.map(stmt => this.visit(stmt))
        if (!statements.length) return Runtime.lit(undefined)
        return Runtime.lit(statements[statements.length - 1])
    }
    Function(fun: Ast.Function): Runtime.Result {
        const func = new Runtime.Function(
            fun.params.length,
            (args: Runtime.Result[]) => {
                const previous = this.env
                this.env = new Runtime.Environment(previous)
                try {
                    args.map((arg, i) => {
                        const param = fun.params[i].text
                        this.env.init(param)
                        this.env.set(param, arg)
                    })
                    this.visit(fun.block)
                } catch (e) {
                    if (e instanceof Runtime.ReturnException) {
                        return e.value
                    } else throw e
                } finally {
                    this.env = previous
                }
            })
        this.env.init(fun.ident.text)
        this.env.set(fun.ident.text, func)
        return func
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
    Call(call: Ast.Call): Runtime.Result {
        const callee = this.visit(call.callee)
        if (!Runtime.isCallable(callee)) throw new Runtime.RuntimeError("uncallable target")
        if (callee.arity != call.args.length) throw new Runtime.RuntimeError("wrong number of args")
        return callee.call(call.args.map(arg => this.visit(arg)))
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
    ReturnStatement(ret: Ast.ReturnStatement): void {
        const ex = new Runtime.ReturnException()
        ex.value = this.visit(ret.expr)
        throw ex
    }
    JumpStatement(statement: Ast.JumpStatement): void {
        const jump = statement.destination.name == TOKEN.BREAK ?
            new Runtime.BreakException() : new Runtime.ContinueException()
        const distance = this.visit(statement.distance || new Ast.Literal(1))
        if (!Runtime.isNumber(distance)) throw new Runtime.RuntimeError("expected numerical distance")
        jump.distance = distance
        throw jump
    }
    Literal(expr: Ast.Literal): Runtime.Result {
        return expr.value
    }
    Logical(expr: Ast.Logical): Runtime.Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left)
        const left_truthy = Runtime.truthy(left)
        if (op == TOKEN.OR && left_truthy) return left
        if (op == TOKEN.AND && !left_truthy) return left
        const right = this.visit(expr.right)
        if (Runtime.truthy(right)) return right
        return Runtime.truthy(false)
    }
    Variable(expr: Ast.Variable): Runtime.Result {
        return this.env.get(expr.name.text)
    }
    Assign(assign: Ast.Assign): Runtime.Result {
        this.env.set(assign.name.text, this.visit(assign.expr))
        return this.env.get(assign.name.text)
    }
    Unary(expr: Ast.Unary): Runtime.Result {
        const { operator: { name: op } } = expr
        const value = this.visit(expr.operand);
        if (op == TOKEN.BANG) return !Runtime.truthy(value);
        if (!Runtime.isNumber(value)) throw new Runtime.RuntimeError("must negate a number value")
        if (op == TOKEN.DASH) return -value;
        throw new Runtime.RuntimeError("Unexpected unary expression")
    }
    Binary(expr: Ast.Binary): Runtime.Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left);
        const right = this.visit(expr.right);
        if (op == TOKEN.COMMA) return right;
        if (op == TOKEN.PLUS) {
            if (Runtime.isString(left) || Runtime.isString(right)) {
                return `${left}${right}`
            }
        }
        if (!Runtime.isNumber(left) || !Runtime.isNumber(right))
            throw new Runtime.RuntimeError("number values expected")
        if (op == TOKEN.PLUS) return left + right;
        if (op == TOKEN.DASH) return left - right;
        if (op == TOKEN.STAR) return left * right;
        if (op == TOKEN.SLASH) return left / right;
        if (op == TOKEN.GREATER) return left > right;
        if (op == TOKEN.GREATER_EQUAL) return left >= right;
        if (op == TOKEN.LESS) return left < right;
        if (op == TOKEN.LESS_EQUAL) return left <= right;
        throw new Runtime.RuntimeError("Unexpected binary expression")
    }
    Ternary(expr: Ast.Ternary): Runtime.Result {
        const { op1: { name: op1 }, op2: { name: op2 } } = expr
        if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
            const left = this.visit(expr.left);
            if (Runtime.truthy(left)) return this.visit(expr.middle);
            return this.visit(expr.right);
        }
        throw new Runtime.RuntimeError("Unexpected ternary expression")
    }
    Grouping(expr: Ast.Grouping): Runtime.Result {
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
