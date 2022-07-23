import * as Ast from './ast'
import * as Runtime from './runtime'

export class Printer extends Ast.Visitor<string> {
    Program(program: Ast.Program): string {
        const decls = program.declarations.map(decl => this.visit(decl)).join("\n")
        return `(program \n${indent(decls)}\n)`
    }
    ReturnStatement(ret: Ast.ReturnStatement): string | void {
        return `(return ${this.visit(ret.expr)})`
    }
    FunctionDeclaration(decl: Ast.FunctionDeclaration): string {
        const name = decl.ident.text
        const val = this.visit(decl.fun)
        return `(fun ${name} ${val})`
    }
    Function(fun: Ast.Function): string {
        const params = fun.params.map(p => p.text).join(' ')
        const body = this.visit(fun.block)
        return `(let [${params}] ${body})`
    }
    Logical(expr: Ast.Logical): string {
        return this.Binary(expr)
    }
    VarDeclaration(declaration: Ast.VarDeclaration): string {
        const decl = `(var ${declaration.ident.text}`
        const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : ''
        return `${decl}${init})`
    }
    Call(call: Ast.Call): string {
        const callee = `(${this.visit(call.callee)}`
        if (!call.args.length) return `${callee})`
        const args = call.args.map(arg => this.visit(arg)).join(' ')
        return `${callee} ${args})`
    }
    PrintStatement(statement: Ast.PrintStatement): string {
        return `(print ${this.visit(statement.expr)})`
    }
    Variable(expr: Ast.Variable): string {
        return `${expr.name.text}`
    }
    ExpressionStatement(statement: Ast.ExpressionStatement): string {
        return this.visit(statement.expr)
    }
    WhileStatement(statement: Ast.WhileStatement): string {
        const cond = this.visit(statement.condition)
        const body = this.visit(statement.body)
        return `(while ${cond} \n${indent(body)}\n)`
    }
    JumpStatement(statement: Ast.JumpStatement): string {
        const dest = statement.destination.name
        const dist = this.visit(statement.distance || new Ast.Literal(1))
        return `(${dest} ${dist})`
    }
    Assign(assign: Ast.Assign): string {
        return `(= ${assign.name.text} ${Runtime.lit(this.visit(assign.expr))})`
    }
    Literal(expr: Ast.Literal): string {
        return Runtime.lit(expr.value)
    }
    Unary(expr: Ast.Unary): string {
        const operator = expr.operator.text
        const operand = this.visit(expr.operand)
        return `(${operator} ${operand})`
    }
    Block(block: Ast.Block): string {
        const blocks = block.statements.map(stmt => this.visit(stmt)).join("\n")
        return `(block \n${indent(blocks)}\n)`
    }
    Binary(expr: Ast.Binary): string {
        const operator = expr.operator.text
        const left = this.visit(expr.left)
        const right = this.visit(expr.right)
        return `(${operator} ${left} ${right})`
    }
    Ternary(expr: Ast.Ternary): string {
        const left = this.visit(expr.left)
        const middle = this.visit(expr.middle)
        const right = this.visit(expr.right)
        return `(?: ${left} ${middle} ${right})`
    }
    Grouping(expr: Ast.Grouping): string {
        const operand = this.visit(expr.inner)
        return `(group ${operand})`
    }
    IfStatement(statement: Ast.IfStatement): string {
        const cond = this.visit(statement.condition)
        const stmtTrue = this.visit(statement.trueStatement)
        if (!statement.falseStatement) return `(if ${cond} ${stmtTrue})`
        const stmtFalse = this.visit(statement.falseStatement)
        return `(if ${cond} \n${indent(stmtTrue)} \n${indent(stmtFalse)})`
    }
}

function indent(text: string): string {
    const pad = new Array(3).fill(' ').join('')
    return text.replace(/^/mg, pad)
}
