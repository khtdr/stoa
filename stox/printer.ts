import { Visitor } from './ast/visitor'
import * as Decl from './ast/declarations'
import * as Expr from './ast/expressions'
import * as Node from './ast/nodes'
import * as Stmt from './ast/statements'

export class Printer extends Visitor<string> {
    AssignExpr(assign: Expr.AssignExpr): string {
        return `(= ${assign.name.text} ${this.visit(assign.value)})`
    }
    BinaryExpr(expr: Expr.BinaryExpr): string {
        const operator = expr.operator.text
        const left = this.visit(expr.left)
        const right = this.visit(expr.right)
        return `(${operator} ${left} ${right})`
    }
    BlockStmt(block: Stmt.BlockStmt): string {
        const blocks = block.statements.map(stmt => this.visit(stmt)).join("\n")
        return `(block \n${indent(blocks)}\n)`
    }
    CallExpr(call: Expr.CallExpr): string {
        const callee = `(call ${this.visit(call.callee)}`
        if (!call.args.length) return `${callee})`
        const args = call.args.map(arg => this.visit(arg)).join(' ')
        return `${callee} ${args})`
    }
    ClassDecl(decl: Decl.ClassDecl): string {
        const funs = decl.funcs.map(fun => this.visit(fun)).join('\n')
        return `(class ${decl.name.text}\n${indent(funs)}\n)`
    }
    ExpressionStmt(statement: Stmt.ExpressionStmt): string {
        return this.visit(statement.expr)
    }
    FunctionExpr(fun: Expr.FunctionExpr): string {
        const params = fun.params.map(p => p.text).join(' ')
        const body = this.visit(fun.block)
        return `(let [${params}] ${body})`
    }
    FunctionDecl(decl: Decl.FunctionDecl): string {
        const name = decl.name.text
        const val = this.visit(decl.func)
        return `(fun ${name} ${val})`
    }
    GetExpr(expr: Expr.GetExpr): string {
        return `(.get ${this.visit(expr.expr)} ${expr.name.text})`
    }
    GroupExpr(expr: Expr.GroupExpr): string {
        const operand = this.visit(expr.inner)
        return `(group ${operand})`
    }
    IfStmt(statement: Stmt.IfStmt): string {
        const cond = this.visit(statement.condition)
        const stmtTrue = this.visit(statement.trueStatement)
        if (!statement.falseStatement) return `(if ${cond} ${stmtTrue})`
        const stmtFalse = this.visit(statement.falseStatement)
        return `(if ${cond} \n${indent(stmtTrue)} \n${indent(stmtFalse)})`
    }
    JumpStmt(statement: Stmt.JumpStmt): string {
        const dest = statement.keyword.name
        const dist = this.visit(statement.distance || new Expr.LiteralExpr([1, 0]))
        return `(${dest} ${dist})`
    }
    LiteralExpr(expr: Expr.LiteralExpr): string {
        const printable = expr.toString()
        return (typeof expr.value === 'string') ? JSON.stringify(printable) : printable
    }
    LogicalExpr(expr: Expr.LogicalExpr): string {
        return this.BinaryExpr(expr)
    }
    PrintStmt(statement: Stmt.PrintStmt): string {
        return `(print ${this.visit(statement.expr)})`
    }
    Program(program: Node.Program): string {
        const decls = program.code.map(decl => this.visit(decl)).join("\n")
        return `(program \n${indent(decls)}\n)`
    }
    ReturnStmt(ret: Stmt.ReturnStmt): string {
        return `(return ${this.visit(ret.expr)})`
    }
    SetExpr(expr: Expr.SetExpr):string {
        return `(.set ${this.visit(expr.expr)} ${expr.name.text} ${this.visit(expr.value)})`
    }
    TernaryExpr(expr: Expr.TernaryExpr): string {
        const left = this.visit(expr.left)
        const middle = this.visit(expr.middle)
        const right = this.visit(expr.right)
        return `(?: ${left} ${middle} ${right})`
    }
    UnaryExpr(expr: Expr.UnaryExpr): string {
        const operator = expr.operator.text
        const operand = this.visit(expr.operand)
        return `(${operator} ${operand})`
    }
    VariableDecl(declaration: Decl.VariableDecl): string {
        const decl = `(var ${declaration.name.text}`
        const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : ''
        return `${decl}${init})`
    }
    VariableExpr(expr: Expr.VariableExpr): string {
        return `${expr.name.text}`
    }
    WhileStmt(statement: Stmt.WhileStmt): string {
        const cond = this.visit(statement.condition)
        const body = this.visit(statement.body)
        return `(while ${cond} \n${indent(body)}\n)`
    }
}

function indent(text: string): string {
    const pad = new Array(3).fill(' ').join('')
    return text.replace(/^/mg, pad)
}
