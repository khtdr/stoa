import * as Ltk from "stoa-ltk";
import * as Ast from "./ast";
import { Interpreter } from "./interpreter";
enum FunctionType {
    NONE,
    FUNCTION,
}

enum VariableType {
    DECLARED,
    DEFINED,
}

/**
 * Lexical bindings and scope *   is static scope
 * which means static/semantic analysis and
 * an extra pass called "Resolver".
 *
 * And other static analysis checks.
 */

export class Resolver extends Ast.Visitor<void> {
    constructor(
        readonly reporter: Ltk.Reporter,
        readonly evaluator: Interpreter
    ) {
        super();
    }
    private currentFunction = FunctionType.NONE;
    private scopes: Record<string, VariableType>[] = [];
    private beginScope() {
        this.scopes.unshift({});
    }
    private endScope() {
        this.scopes.shift();
    }
    private declare(ident: Ltk.Token<"IDENTIFIER">) {
        const scope = this.scopes[0];
        if (!scope) return;
        if (scope[ident.text] === VariableType.DECLARED)
            this.reporter.error(ident, "Variable is already declared");
        if (scope[ident.text] === VariableType.DEFINED)
            this.reporter.error(ident, "Variable is already defined");
        scope[ident.text] = VariableType.DECLARED;
    }
    private define(ident: Ltk.Token<"IDENTIFIER">) {
        const scope = this.scopes[0];
        if (!scope) return;
        scope[ident.text] = VariableType.DEFINED;
    }
    private resolveLocal(expr: Ast.Expression, token: Ltk.Token<"IDENTIFIER">) {
        this.scopes.find((scope, i) => {
            if (scope[token.text]) {
                this.evaluator.resolve(expr, i);
                return true;
            }
            return false;
        });
    }
    private resolveFunction(fun: Ast.FunctionExpr, ft: FunctionType) {
        const encFunction = this.currentFunction;
        this.currentFunction = ft;
        this.beginScope();
        for (const param of fun.params) {
            this.declare(param);
            this.define(param);
        }
        this.visit(fun.block);
        this.endScope();
        this.currentFunction = encFunction;
    }

    AssignExpr(expr: Ast.AssignExpr) {
        this.visit(expr.value);
        this.resolveLocal(expr, expr.name);
    }
    BinaryExpr(expr: Ast.BinaryExpr) {
        this.visit(expr.left);
        this.visit(expr.right);
    }
    BlockStmt(block: Ast.BlockStmt) {
        this.beginScope();
        for (const stmt of block.statements) this.visit(stmt);
        this.endScope();
    }
    CallExpr(expr: Ast.CallExpr) {
        this.visit(expr.callee);
        for (const arg of expr.args) this.visit(arg);
    }
    ExpressionStmt(stmt: Ast.ExpressionStmt) {
        this.visit(stmt.expr);
    }
    FunctionExpr(expr: Ast.FunctionExpr) {
        this.resolveFunction(expr, FunctionType.FUNCTION);
    }
    FunctionDecl(decl: Ast.FunctionDecl) {
        this.declare(decl.name);
        this.define(decl.name);
        this.resolveFunction(decl.func, FunctionType.FUNCTION);
    }
    GroupExpr(expr: Ast.GroupExpr) {
        this.visit(expr.inner);
    }
    IfStmt(stmt: Ast.IfStmt) {
        this.visit(stmt.condition);
        this.visit(stmt.trueStatement);
        if (stmt.falseStatement) this.visit(stmt.falseStatement);
    }
    JumpStmt(stmt: Ast.JumpStmt) {
        this.visit(stmt.distance);
    }
    LiteralExpr(_expr: Ast.LiteralExpr) { }
    LogicalExpr(expr: Ast.LogicalExpr) {
        this.visit(expr.left);
        this.visit(expr.right);
    }
    PrintStmt(stmt: Ast.PrintStmt) {
        this.visit(stmt.expr);
    }
    Program(program: Ast.Program) {
        for (const decl of program.code) this.visit(decl);
    }
    ReturnStmt(stmt: Ast.ReturnStmt) {
        if (this.currentFunction == FunctionType.NONE)
            this.reporter.error(stmt.keyword, "No return from top-level allowed");
        this.visit(stmt.expr);
    }
    TernaryExpr(expr: Ast.TernaryExpr) {
        this.visit(expr.left);
        this.visit(expr.middle);
        this.visit(expr.right);
    }
    UnaryExpr(expr: Ast.UnaryExpr) {
        this.visit(expr.operand);
    }
    VariableDecl(decl: Ast.VariableDecl) {
        this.declare(decl.name);
        if (decl.expr) {
            this.visit(decl.expr);
        }
        this.define(decl.name);
    }
    VariableExpr(expr: Ast.VariableExpr) {
        const scope = this.scopes[0];
        if (!scope) return;
        if (scope[expr.name.text] === VariableType.DECLARED)
            this.reporter.error(expr.name, "Reference to uninitialized variable");
        this.resolveLocal(expr, expr.name);
    }
    WhileStmt(stmt: Ast.WhileStmt) {
        this.visit(stmt.condition);
        this.visit(stmt.body);
    }
}
