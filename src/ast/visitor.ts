import * as Lib from '../lib'
import type * as Ast from '../ast'

export abstract class Visitor<Result = void> extends Lib.Visitor<Ast.Visitable, Result> {
    abstract AssignExpr(expr: Ast.AssignExpr): Result
    abstract BinaryExpr(expr: Ast.BinaryExpr): Result
    abstract BlockStmt(stmt: Ast.BlockStmt): Result
    abstract CallExpr(expr: Ast.CallExpr): Result
    abstract ExpressionStmt(stmt: Ast.ExpressionStmt): Result
    abstract FunctionExpr(expr: Ast.FunctionExpr): Result
    abstract FunctionDecl(decl: Ast.FunctionDecl): Result
    abstract GroupExpr(expr: Ast.GroupExpr): Result
    abstract IfStmt(stmt: Ast.IfStmt): Result
    abstract JumpStmt(stmt: Ast.JumpStmt): Result
    abstract LiteralExpr(expr: Ast.LiteralExpr): Result
    abstract LogicalExpr(expr: Ast.LogicalExpr): Result
    abstract PrintStmt(stmt: Ast.PrintStmt): Result
    abstract Program(program: Ast.Program): Result
    abstract ReturnStmt(stmt: Ast.ReturnStmt): Result
    abstract TernaryExpr(expr: Ast.TernaryExpr): Result
    abstract UnaryExpr(expr: Ast.UnaryExpr): Result
    abstract VariableDecl(decl: Ast.VariableDecl): Result
    abstract VariableExpr(expr: Ast.VariableExpr): Result
    abstract WhileStmt(stmt: Ast.WhileStmt): Result
}
