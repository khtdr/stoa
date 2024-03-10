import * as Ltk from 'stoa-ltk'
import type * as Decl from './declarations'
import type * as Expr from './expressions'
import type * as Node from './nodes'
import type * as Stmt from './statements'

export abstract class Visitor<Result = void> extends Ltk.Visitor<Node.Ast, Result> {
    abstract AssignExpr(expr: Expr.AssignExpr): Result
    abstract BinaryExpr(expr: Expr.BinaryExpr): Result
    abstract BlockStmt(stmt: Stmt.BlockStmt): Result
    abstract CallExpr(expr: Expr.CallExpr): Result
    abstract ClassDecl(decl: Decl.ClassDecl): Result
    abstract ExpressionStmt(stmt: Stmt.ExpressionStmt): Result
    abstract FunctionExpr(expr: Expr.FunctionExpr): Result
    abstract FunctionDecl(decl: Decl.FunctionDecl): Result
    abstract GetExpr(expr: Expr.GetExpr): Result
    abstract GroupExpr(expr: Expr.GroupExpr): Result
    abstract IfStmt(stmt: Stmt.IfStmt): Result
    abstract JumpStmt(stmt: Stmt.JumpStmt): Result
    abstract LiteralExpr(expr: Expr.LiteralExpr): Result
    abstract LogicalExpr(expr: Expr.LogicalExpr): Result
    abstract PrintStmt(stmt: Stmt.PrintStmt): Result
    abstract Program(program: Node.Program): Result
    abstract ReturnStmt(stmt: Stmt.ReturnStmt): Result
    abstract SetExpr(expr: Expr.SetExpr): Result
    abstract TernaryExpr(expr: Expr.TernaryExpr): Result
    abstract ThisExpr(expr: Expr.ThisExpr): Result
    abstract UnaryExpr(expr: Expr.UnaryExpr): Result
    abstract VariableDecl(decl: Decl.VariableDecl): Result
    abstract VariableExpr(expr: Expr.VariableExpr): Result
    abstract WhileStmt(stmt: Stmt.WhileStmt): Result
}
