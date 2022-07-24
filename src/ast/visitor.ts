import * as Lib from '../lib'
import type * as Ast from '../ast'

export abstract class Visitor<Result = void> extends Lib.Visitor<Ast.Visitable, Result> {
    abstract AssignExpr(assign: Ast.AssignExpr): Result
    abstract BinaryExpr(expr: Ast.BinaryExpr): Result
    abstract BlockStmt(block: Ast.BlockStmt): Result | void
    abstract CallExpr(call: Ast.CallExpr): Result
    abstract ExpressionStmt(statement: Ast.ExpressionStmt): Result | void
    abstract FunctionExpr(fun: Ast.FunctionExpr): Result
    abstract FunctionDecl(decl: Ast.FunctionDecl): Result | void
    abstract GroupExpr(expr: Ast.GroupExpr): Result
    abstract IfStmt(statement: Ast.IfStmt): Result | void
    abstract JumpStmt(statement: Ast.JumpStmt): Result | void
    abstract LiteralExpr(expr: Ast.LiteralExpr): Result
    abstract LogicalExpr(expr: Ast.LogicalExpr): Result
    abstract PrintStmt(statement: Ast.PrintStmt): Result | void
    abstract Program(program: Ast.Program): Result | void
    abstract ReturnStmt(ret: Ast.ReturnStmt): Result | void
    abstract TernaryExpr(expr: Ast.TernaryExpr): Result
    abstract UnaryExpr(expr: Ast.UnaryExpr): Result
    abstract VariableDecl(declaration: Ast.VariableDecl): Result | void
    abstract VariableExpr(expr: Ast.VariableExpr): Result
    abstract WhileStmt(statement: Ast.WhileStmt): Result | void
}
