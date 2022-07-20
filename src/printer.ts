import * as Ast from './ast'
import * as Runtime from './runtime'

export class Printer extends Ast.Visitor<string> {
    indent = 0
    Program(program: Ast.Program): string {
        this.indent = 2
        const decls = program.declarations.map(decl => this.visit(decl)).join("\n")
        return `(program \n${indent(decls, this.indent)}\n)`
    }
    Logical(expr: Ast.Logical): string {
        return this.Binary(expr)
    }
    VarDeclaration(declaration: Ast.VarDeclaration): string {
        const decl = `(var ${declaration.ident.text}`
        const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : ''
        return `${decl}${init})`
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
        this.indent += 2
        const blocks = block.statements.map(stmt => this.visit(stmt)).join("\n")
        const block_string = `(block \n${indent(blocks, this.indent)}\n)`
        this.indent -= 2
        return block_string
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
        this.indent += 2
        const str = `(if ${cond} \n${indent(stmtTrue, this.indent)} \n${indent(stmtFalse, this.indent)})`
        this.indent -= 2
        return str
    }
}

function indent(text: string, by: number): string {
    const pad = new Array(by).fill(' ').join('')
    return text.replace(/^/mg, pad)
}
