import * as Lib from './lib'
import * as Ast from './ast'
import { Interpreter } from './interpreter'
import { Reporter } from './errors'

export class Resolver extends Ast.Visitor<void> {
    constructor(
        readonly evaluator: Interpreter,
        readonly reporter: Reporter
    ) { super() }
    scopes: Record<string, boolean>[] = []
    beginScope() {
        this.scopes.unshift({})
    }
    endScope() {
        this.scopes.shift()
    }
    declare(ident: Lib.Token<'IDENTIFIER'>) {
        const scope = this.scopes[0]
        if (!scope) return
        scope[ident.text] = false
    }
    define(ident: Lib.Token<'IDENTIFIER'>) {
        const scope = this.scopes[0]
        if (!scope) return
        scope[ident.text] = true
    }
    resolveLocal(expr: Ast.Expression, token: Lib.Token<'IDENTIFIER'>) {
        this.scopes.find((scope, i) => {
            if (scope[token.text]) {
                this.evaluator.resolve(expr, i)
                return true
            }
            return false
        })
    }
    resolveFunction(fun: Ast.FunctionExpr) {
        this.beginScope()
        for (const param of fun.params) {
            this.declare(param)
            this.define(param)
        }
        this.visit(fun.block)
        this.endScope()
    }

    AssignExpr(expr: Ast.AssignExpr) {
        this.visit(expr.value)
        this.resolveLocal(expr, expr.name)
    }
    BinaryExpr(expr: Ast.BinaryExpr) {
        this.visit(expr.left); this.visit(expr.right)
    }
    BlockStmt(block: Ast.BlockStmt) {
        this.beginScope()
        for (const stmt of block.statements) this.visit(stmt)
        this.endScope()
    }
    CallExpr(expr: Ast.CallExpr) {
        this.visit(expr.callee)
        for (const arg of expr.args) this.visit(arg)
    }
    ExpressionStmt(stmt: Ast.ExpressionStmt) {
        this.visit(stmt.expr)
    }
    FunctionExpr(expr: Ast.FunctionExpr) {
        this.resolveFunction(expr)
    }
    FunctionDecl(decl: Ast.FunctionDecl) {
        this.declare(decl.ident)
        this.define(decl.ident)
        this.resolveFunction(decl.fun)
    }
    GroupExpr(expr: Ast.GroupExpr) {
        this.visit(expr.inner)
    }
    IfStmt(stmt: Ast.IfStmt) {
        this.visit(stmt.condition)
        this.visit(stmt.trueStatement)
        if (stmt.falseStatement) this.visit(stmt.falseStatement)
    }
    JumpStmt(stmt: Ast.JumpStmt) {
        this.visit(stmt.distance)
    }
    LiteralExpr(_expr: Ast.LiteralExpr) {
    }
    LogicalExpr(expr: Ast.LogicalExpr) {
        this.visit(expr.left)
        this.visit(expr.right)
    }
    PrintStmt(stmt: Ast.PrintStmt) {
        this.visit(stmt.expr)
    }
    Program(program: Ast.Program) {
        for (const decl of program.code) this.visit(decl)
    }
    ReturnStmt(stmt: Ast.ReturnStmt) {
        this.visit(stmt.expr)
    }
    TernaryExpr(expr: Ast.TernaryExpr) {
        this.visit(expr.left)
        this.visit(expr.middle)
        this.visit(expr.right)
    }
    UnaryExpr(expr: Ast.UnaryExpr) {
        this.visit(expr.operand)
    }
    VariableDecl(decl: Ast.VariableDecl) {
        this.declare(decl.ident)
        if (decl.expr) {
            this.visit(decl.expr)
        }
        this.define(decl.ident)
    }
    VariableExpr(expr: Ast.VariableExpr) {
        const scope = this.scopes[0]
        if (!scope) return // the following ex needs reported, not thrown
        if (Object.keys(scope).includes(expr.name.text) && !scope[expr.name.text]) throw new Lib.ParseError('cant reference self in initializer')
        this.resolveLocal(expr, expr.name)
    }
    WhileStmt(stmt: Ast.WhileStmt) {
        this.visit(stmt.condition)
        this.visit(stmt.body)
    }
}
