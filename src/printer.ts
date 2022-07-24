import * as Ast from './ast'

export class Printer extends Ast.Visitor<string> {
    AssignExpr(assign: Ast.AssignExpr): string {
        return `(= ${assign.name.text} ${this.visit(assign.value)})`
    }
    BinaryExpr(expr: Ast.BinaryExpr): string {
        const operator = expr.operator.text
        const left = this.visit(expr.left)
        const right = this.visit(expr.right)
        return `(${operator} ${left} ${right})`
    }
    BlockStmt(block: Ast.BlockStmt): string {
        const blocks = block.statements.map(stmt => this.visit(stmt)).join("\n")
        return `(block \n${indent(blocks)}\n)`
    }
    CallExpr(call: Ast.CallExpr): string {
        const callee = `(${this.visit(call.callee)}`
        if (!call.args.length) return `${callee})`
        const args = call.args.map(arg => this.visit(arg)).join(' ')
        return `${callee} ${args})`
    }
    ExpressionStmt(statement: Ast.ExpressionStmt): string {
        return this.visit(statement.expr)
    }
    FunctionExpr(fun: Ast.FunctionExpr): string {
        const params = fun.params.map(p => p.text).join(' ')
        const body = this.visit(fun.block)
        return `(let [${params}] ${body})`
    }
    FunctionDecl(decl: Ast.FunctionDecl): string {
        const name = decl.ident.text
        const val = this.visit(decl.fun)
        return `(fun ${name} ${val})`
    }
    GroupExpr(expr: Ast.GroupExpr): string {
        const operand = this.visit(expr.inner)
        return `(group ${operand})`
    }
    IfStmt(statement: Ast.IfStmt): string {
        const cond = this.visit(statement.condition)
        const stmtTrue = this.visit(statement.trueStatement)
        if (!statement.falseStatement) return `(if ${cond} ${stmtTrue})`
        const stmtFalse = this.visit(statement.falseStatement)
        return `(if ${cond} \n${indent(stmtTrue)} \n${indent(stmtFalse)})`
    }
    JumpStmt(statement: Ast.JumpStmt): string {
        const dest = statement.destination.name
        const dist = this.visit(statement.distance || new Ast.LiteralExpr([1, 0]))
        return `(${dest} ${dist})`
    }
    LiteralExpr(expr: Ast.LiteralExpr): string {
        return expr.toString()
    }
    LogicalExpr(expr: Ast.LogicalExpr): string {
        return this.BinaryExpr(expr)
    }
    PrintStmt(statement: Ast.PrintStmt): string {
        return `(print ${this.visit(statement.expr)})`
    }
    Program(program: Ast.Program): string {
        const decls = program.code.map(decl => this.visit(decl)).join("\n")
        return `(program \n${indent(decls)}\n)`
    }
    ReturnStmt(ret: Ast.ReturnStmt): string {
        return `(return ${this.visit(ret.expr)})`
    }
    TernaryExpr(expr: Ast.TernaryExpr): string {
        const left = this.visit(expr.left)
        const middle = this.visit(expr.middle)
        const right = this.visit(expr.right)
        return `(?: ${left} ${middle} ${right})`
    }
    UnaryExpr(expr: Ast.UnaryExpr): string {
        const operator = expr.operator.text
        const operand = this.visit(expr.operand)
        return `(${operator} ${operand})`
    }
    VariableDecl(declaration: Ast.VariableDecl): string {
        const decl = `(var ${declaration.ident.text}`
        const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : ''
        return `${decl}${init})`
    }
    VariableExpr(expr: Ast.VariableExpr): string {
        return `${expr.name.text}`
    }
    WhileStmt(statement: Ast.WhileStmt): string {
        const cond = this.visit(statement.condition)
        const body = this.visit(statement.body)
        return `(while ${cond} \n${indent(body)}\n)`
    }
}

function indent(text: string): string {
    const pad = new Array(3).fill(' ').join('')
    return text.replace(/^/mg, pad)
}
