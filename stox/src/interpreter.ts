import { Reporter } from "stoa-ltk";
import { Expression, Token, TOKEN } from "ast/index";
import { LiteralExpr } from "ast/expressions";
import { Visitor } from "ast/visitor";
import { Result, RuntimeError } from "runtime/base";
import { Environment } from "runtime/environment";
import { registerGlobals } from "runtime/globals";
import { isNumber, isString, truthy } from "runtime/values";
import { BreakException, ContinueException, Function, isCallable, JumpException, ReturnException } from "runtime/control-flow";
import * as Node from "ast/index";

/**
 * Goals
 * 1) runtime error checking
 * 2) defer to runtime library for behavior
 */

export class Interpreter extends Visitor<Result> {
    constructor(readonly reporter: Reporter) {
        super()
        registerGlobals(this)
    }

    readonly globals = new Environment()
    private env = this.globals

    locals: Map<Expression, number> = new Map()
    resolve(expr: Expression, depth: number) {
        this.locals.set(expr, depth)
    }
    lookUpVariable(name: Token<'IDENTIFIER'>, expr: Expression) {
        const distance = this.locals.get(expr)
        if (distance !== undefined) return this.env.get(name, distance)
        return this.globals.get(name)
    }

    AssignExpr(expr: Node.AssignExpr): Result {
        const value = this.visit(expr.value)
        const distance = this.locals.get(expr)
        if (distance !== undefined) this.env.set(expr.name, value, distance)
        else this.globals.set(expr.name, value)
        return value
    }
    BinaryExpr(expr: Node.BinaryExpr): Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left);
        const right = this.visit(expr.right);
        if (op == TOKEN.COMMA) return right;
        if (op == TOKEN.PLUS) {
            if (isString(left) || isString(right)) {
                const lStr = (isCallable(left)) ? left : new LiteralExpr(left)
                const rStr = (isCallable(right)) ? right : new LiteralExpr(right)
                return `${lStr}${rStr}`
            }
        }
        if (op == TOKEN.EQUAL_EQUAL) {
            if (isNumber(left) && isNumber(right))
                return left[0] == right[0]
            else return left === right
        }
        if (op == TOKEN.BANG_EQUAL) {
            if (isNumber(left) && isNumber(right))
                return left[0] != right[0]
            else return left !== right
        }

        if (!isNumber(left) || !isNumber(right))
            throw new RuntimeError(expr.operator, "number values expected")
        if (right[0] == 0) throw new RuntimeError(expr.operator, "divide by zero")
        if (op == TOKEN.PLUS) return [left[0] + right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.DASH) return [left[0] - right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.STAR) return [left[0] * right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.SLASH) return [left[0] / right[0], Math.max(left[1], right[1])];
        if (op == TOKEN.GREATER) return left[0] > right[0]
        if (op == TOKEN.GREATER_EQUAL) return left[0] >= right[0]
        if (op == TOKEN.LESS) return left[0] < right[0]
        if (op == TOKEN.LESS_EQUAL) return left[0] <= right[0]
        throw new RuntimeError(expr.operator, "Unexpected binary expression")
    }
    BlockStmt(block: Node.BlockStmt): Result {
        const previous = this.env
        this.env = new Environment(previous)
        try {
            block.statements.map(stmt => this.visit(stmt))
        } finally {
            this.env = previous
        }
    }
    CallExpr(call: Node.CallExpr): Result {
        const callee = this.visit(call.callee)
        if (!isCallable(callee)) throw new RuntimeError(call.end, "uncallable target")
        if (callee.arity != call.args.length) throw new RuntimeError(call.end, "wrong number of args")
        return callee.call(call.args.map(arg => this.visit(arg)))
    }
    ExpressionStmt(statement: Node.ExpressionStmt): void {
        this.visit(statement.expr)
    }
    FunctionExpr(fun: Node.FunctionExpr): Result {
        const closure = new Environment(this.env)
        return new Function(
            fun.params.length,
            (args: Result[]) => {
                const previous = this.env
                this.env = new Environment(closure)
                try {
                    args.map((arg, i) => {
                        const param = fun.params[i]
                        this.env.init(param)
                        this.env.set(param, arg)
                    })
                    this.visit(fun.block)
                } catch (e) {
                    if (e instanceof ReturnException) {
                        return e.value
                    } else throw e
                } finally {
                    this.env = previous
                }
            })
    }
    FunctionDecl(decl: Node.FunctionDecl): Result {
        const func = this.FunctionExpr(decl.func)
        this.env.init(decl.name)
        this.env.set(decl.name, func)
    }
    GroupExpr(expr: Node.GroupExpr): Result {
        return this.visit(expr.inner);
    }
    IfStmt(statement: Node.IfStmt): Result {
        const condition = this.visit(statement.condition);
        if (truthy(condition)) this.visit(statement.trueStatement);
        else if (statement.falseStatement) this.visit(statement.falseStatement);
    }
    JumpStmt(stmt: Node.JumpStmt): Result {
        const distance = this.visit(stmt.distance || new LiteralExpr([1, 0]))
        if (!isNumber(distance))
            throw new RuntimeError(stmt.keyword, "expected numerical distance")
        throw stmt.keyword.name == TOKEN.BREAK
            ? new BreakException(distance[0])
            : new ContinueException(distance[0])
    }
    LiteralExpr(expr: Node.LiteralExpr): Result {
        return expr.value
    }
    LogicalExpr(expr: Node.LogicalExpr): Result {
        const { operator: { name: op } } = expr
        const left = this.visit(expr.left)
        const left_truthy = truthy(left)
        if (op == TOKEN.OR && left_truthy) return left
        if (op == TOKEN.AND && !left_truthy) return left
        const right = this.visit(expr.right)
        if (truthy(right)) return right
        return truthy(false)
    }
    PrintStmt(statement: Node.PrintStmt): void {
        const val = this.visit(statement.expr)
        const str = (isCallable(val)) ? val : new LiteralExpr(val).toString()
        console.log(str + '')
    }
    Program(program: Node.Program): Result {
        try {
            const statements = program.code.map(stmt => this.visit(stmt))
            const last = statements[statements.length - 1]
            if (isCallable(last)) return `${last}`
            return new LiteralExpr(last).toString()
        } catch (e) {
            if (!(e instanceof RuntimeError)) {
                // need some token?
                // @ts-expect-error
                this.reporter.error(undefined, (e as Error).message)
            } else {
                this.reporter.error(e.token, e.message)
            }
        }
    }
    ReturnStmt(ret: Node.ReturnStmt): Result {
        const value = this.visit(ret.expr)
        throw new ReturnException(value)
    }
    TernaryExpr(expr: Node.TernaryExpr): Result {
        const { op1: { name: op1 }, op2: { name: op2 } } = expr
        if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
            const left = this.visit(expr.left);
            if (truthy(left)) return this.visit(expr.middle);
            return this.visit(expr.right);
        }
        throw new RuntimeError(op1, "Unexpected ternary expression")
    }
    UnaryExpr(expr: Node.UnaryExpr): Result {
        const { operator: { name: op } } = expr
        const value = this.visit(expr.operand);
        if (op == TOKEN.BANG) return !truthy(value);
        if (!isNumber(value)) throw new RuntimeError(op, "must negate a number value")
        if (op == TOKEN.DASH) return [-value[0], value[1]];
        throw new RuntimeError(op, "Unexpected unary expression")
    }
    VariableDecl(declaration: Node.VariableDecl): Result {
        this.env.init(declaration.name)
        const val = declaration.expr ? this.visit(declaration.expr) : undefined
        this.env.set(declaration.name, val)
    }
    VariableExpr(expr: Node.VariableExpr): Result {
        return this.lookUpVariable(expr.name, expr)
    }
    WhileStmt(statement: Node.WhileStmt): Result {
        while (truthy(this.visit(statement.condition))) {
            try {
                this.visit(statement.body)
            } catch (e) {
                if (e instanceof JumpException) {
                    if (e.distance > 1) {
                        e.distance -= 1
                        throw e
                    }
                    if (e instanceof ContinueException) continue
                    if (e instanceof BreakException) break
                }
            }
        }
    }
}
