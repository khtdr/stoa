import * as Lib from './lib'
import * as Ast from './ast'
import { Evaluator } from './evaluator'

export class Resolver extends Ast.Visitor<void> {
    constructor(
        readonly evaluator: Evaluator
    ) { super() }
    scopes: Record<string, boolean>[] = []
    beginScope() { this.scopes.unshift({}) }
    endScope() { this.scopes.shift() }
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

    AssignExpr(assign: Ast.AssignExpr) {
        this.visit(assign.expr)
        this.resolveLocal(assign, assign.name)
    }
    BinaryExpr(expr: Ast.BinaryExpr) { this.visit(expr.left); this.visit(expr.right) }
    BlockStmt(block: Ast.BlockStmt) {
        this.beginScope()
        for (const stmt of block.statements) this.visit(stmt)
        this.endScope()
    }
    CallExpr(call: Ast.CallExpr) {
        this.visit(call.callee)
        for (const arg of call.args) this.visit(arg)
    }
    ExpressionStmt(statement: Ast.ExpressionStmt) { this.visit(statement.expr) }
    FunctionExpr(fun: Ast.FunctionExpr) {
        this.resolveFunction(fun)
    }
    FunctionDecl(decl: Ast.FunctionDecl) {
        this.declare(decl.ident)
        this.define(decl.ident)
        this.resolveFunction(decl.fun)
    }
    GroupExpr(expr: Ast.GroupExpr) { this.visit(expr.inner) }
    IfStmt(statement: Ast.IfStmt) {
        this.visit(statement.condition)
        this.visit(statement.trueStatement)
        if (statement.falseStatement) this.visit(statement.falseStatement)
    }
    JumpStmt(statement: Ast.JumpStmt) { this.visit(statement.distance) }
    LiteralExpr(_expr: Ast.LiteralExpr) { }
    LogicalExpr(expr: Ast.LogicalExpr) { this.visit(expr.left); this.visit(expr.right) }
    PrintStmt(statement: Ast.PrintStmt) { this.visit(statement.expr) }
    Program(program: Ast.Program) { for (const decl of program.code) this.visit(decl) }
    ReturnStmt(ret: Ast.ReturnStmt) { this.visit(ret.expr) }
    TernaryExpr(expr: Ast.TernaryExpr) { this.visit(expr.left); this.visit(expr.middle); this.visit(expr.right) }
    UnaryExpr(expr: Ast.UnaryExpr) { this.visit(expr.operand) }
    VariableDecl(declaration: Ast.VariableDecl) {
        this.declare(declaration.ident)
        if (declaration.expr) {
            this.visit(declaration.expr)
        }
        this.define(declaration.ident)
    }
    VariableExpr(expr: Ast.VariableExpr) {
        const scope = this.scopes[0]
        if (!scope) return // the following ex needs reported, not thrown
        if (!scope[expr.name.text]) throw new Lib.ParseError('cant reference self in initializer')
        this.resolveLocal(expr, expr.name)
    }
    WhileStmt(statement: Ast.WhileStmt) {
        this.visit(statement.condition)
        this.visit(statement.body)
    }
}
