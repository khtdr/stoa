import * as Ast from "./ast";
import * as Runtime from './runtime'
import { registerGlobals } from "./globals";
import { TOKEN } from "./scanner";
import { Reporter } from "./errors";

export class Interpreter extends Ast.Visitor<Runtime.Result> {
    readonly globals = new Runtime.Environment()
    private env = this.globals

    constructor(
        readonly reporter: Reporter
    ) {
        super()
        registerGlobals(this)
    }
    locals: Map<Ast.Expression, number> = new Map()
    resolve(expr: Ast.Expression, depth: number) {
        this.locals.set(expr, depth)
    }
    lookUpVariable(name: Ast.Token<'IDENTIFIER'>, expr: Ast.Expression) {
        const distance = this.locals.get(expr)
        if (distance !== undefined) return this.env.get(name.text, distance)
        return this.globals.get(name.text)
    }

    AssignExpr(expr: Ast.AssignExpr): Runtime.Result {
        const value = this.visit(expr.value)
        const distance = this.locals.get(expr)
        if (distance !== undefined) this.env.set(expr.name.text, value, distance)
        else this.globals.set(expr.name.text, value)
        return value
    }
    BinaryExpr(expr: Ast.BinaryExpr): Runtime.Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left);
        const right = this.visit(expr.right);
        if (op == TOKEN.COMMA) return right;
        if (op == TOKEN.PLUS) {
            if (Runtime.isString(left) || Runtime.isString(right)) {
                const lStr = (Runtime.isCallable(left)) ? left : new Ast.LiteralExpr(left)
                const rStr = (Runtime.isCallable(right)) ? right : new Ast.LiteralExpr(right)
                return `${lStr}${rStr}`
            }
        }
        if (!Runtime.isNumber(left) || !Runtime.isNumber(right))
            throw new Runtime.RuntimeError("number values expected")
        if (op == TOKEN.PLUS) return [left[0] + right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.DASH) return [left[0] - right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.STAR) return [left[0] * right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.SLASH) return [left[0] / right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.GREATER) return left[0] > right[0]
        if (op == TOKEN.GREATER_EQUAL) return left[0] >= right[0]
        if (op == TOKEN.LESS) return left[0] < right[0]
        if (op == TOKEN.LESS_EQUAL) return left[0] <= right[0]
        throw new Runtime.RuntimeError("Unexpected binary expression")
    }
    BlockStmt(block: Ast.BlockStmt): Runtime.Result {
        const previous = this.env
        this.env = new Runtime.Environment(previous)
        try {
            block.statements.map(stmt => this.visit(stmt))
        } finally {
            this.env = previous
        }
    }
    CallExpr(call: Ast.CallExpr): Runtime.Result {
        const callee = this.visit(call.callee)
        if (!Runtime.isCallable(callee)) throw new Runtime.RuntimeError("uncallable target")
        if (callee.arity != call.args.length) throw new Runtime.RuntimeError("wrong number of args")
        return callee.call(call.args.map(arg => this.visit(arg)))
    }
    ExpressionStmt(statement: Ast.ExpressionStmt): void {
        this.visit(statement.expr)
    }
    FunctionExpr(fun: Ast.FunctionExpr): Runtime.Result {
        const closure = new Runtime.Environment(this.env)
        return new Runtime.Function(
            fun.params.length,
            (args: Runtime.Result[]) => {
                const previous = this.env
                this.env = new Runtime.Environment(closure)
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
    }
    FunctionDecl(decl: Ast.FunctionDecl): Runtime.Result {
        const func = this.FunctionExpr(decl.fun)
        this.env.init(decl.ident.text)
        this.env.set(decl.ident.text, func)
    }
    GroupExpr(expr: Ast.GroupExpr): Runtime.Result {
        return this.visit(expr.inner);
    }
    IfStmt(statement: Ast.IfStmt): Runtime.Result {
        const condition = this.visit(statement.condition);
        if (Runtime.truthy(condition)) this.visit(statement.trueStatement);
        else if (statement.falseStatement) this.visit(statement.falseStatement);
    }
    JumpStmt(statement: Ast.JumpStmt): Runtime.Result {
        const jump = statement.destination.name == TOKEN.BREAK ?
            new Runtime.BreakException() : new Runtime.ContinueException()
        const distance = this.visit(statement.distance || new Ast.LiteralExpr([1, 0]))
        if (!Runtime.isNumber(distance)) throw new Runtime.RuntimeError("expected numerical distance")
        jump.distance = distance[0]
        throw jump
    }
    LiteralExpr(expr: Ast.LiteralExpr): Runtime.Result {
        return expr.value
    }
    LogicalExpr(expr: Ast.LogicalExpr): Runtime.Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left)
        const left_truthy = Runtime.truthy(left)
        if (op == TOKEN.OR && left_truthy) return left
        if (op == TOKEN.AND && !left_truthy) return left
        const right = this.visit(expr.right)
        if (Runtime.truthy(right)) return right
        return Runtime.truthy(false)
    }
    PrintStmt(statement: Ast.PrintStmt): void {
        const val = this.visit(statement.expr)
        const str = (Runtime.isCallable(val)) ? val : new Ast.LiteralExpr(val).toString()
        console.log(str + '')
    }
    Program(program: Ast.Program): Runtime.Result {
        const statements = program.code.map(stmt => this.visit(stmt))
        const last = statements[statements.length - 1]
        if (Runtime.isCallable(last)) return `${last}`
        return new Ast.LiteralExpr(last).toString()
    }
    ReturnStmt(ret: Ast.ReturnStmt): Runtime.Result {
        const ex = new Runtime.ReturnException()
        ex.value = this.visit(ret.expr)
        throw ex
    }
    TernaryExpr(expr: Ast.TernaryExpr): Runtime.Result {
        const { op1: { name: op1 }, op2: { name: op2 } } = expr
        if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
            const left = this.visit(expr.left);
            if (Runtime.truthy(left)) return this.visit(expr.middle);
            return this.visit(expr.right);
        }
        throw new Runtime.RuntimeError("Unexpected ternary expression")
    }
    UnaryExpr(expr: Ast.UnaryExpr): Runtime.Result {
        const { operator: { name: op } } = expr
        const value = this.visit(expr.operand);
        if (op == TOKEN.BANG) return !Runtime.truthy(value);
        if (!Runtime.isNumber(value)) throw new Runtime.RuntimeError("must negate a number value")
        if (op == TOKEN.DASH) return [-value[0], value[1]];
        throw new Runtime.RuntimeError("Unexpected unary expression")
    }
    VariableDecl(declaration: Ast.VariableDecl): Runtime.Result {
        this.env.init(declaration.ident.text)
        const val = declaration.expr ? this.visit(declaration.expr) : undefined
        this.env.set(declaration.ident.text, val)
    }
    VariableExpr(expr: Ast.VariableExpr): Runtime.Result {
        return this.lookUpVariable(expr.name, expr)
    }
    WhileStmt(statement: Ast.WhileStmt): Runtime.Result {
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
}
