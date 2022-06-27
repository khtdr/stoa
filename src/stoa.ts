import { Launcher, Language, TokenStreamClassFactory, Token, TokenStream, Lexicon, Parser } from './lib'
import { version } from '../package.json'

function stringScanner(value: string) {
    const tokenizer = new TokenStream(value, {
        SINGLE: "'",
        DOUBLE: '"',
        ESCAPED_CHAR: /\\./,
        CHAR: /./,
    })
    const opener = tokenizer.take()
    if (["SINGLE", "DOUBLE"].includes(opener?.name)) {
        let closer, text = opener.text
        while (closer = tokenizer.take()) {
            text += closer.text
            if (closer.name == opener.name) return text
        }
    }
}

const [LoxScanner, Lx] = TokenStreamClassFactory.build({
    NIL: 'nil', TRUE: 'true', FALSE: 'false',
    PLUS: '+', DASH: '-', STAR: '*', SLASH: '/', EQUAL: '=',
    AND: /and/i, OR: /or/i, NOT: /not/i, VAR: /var/i,
    SEMICOLON: ';', LEFT_PAREN: '(', RIGHT_PAREN: ')',
    LEFT_CURL: '{', RIGHT_CURL: '}', SUPER: 'super',
    EQUAL_EQUAL: '==', BANG_EQUAL: '!=', BANG: '!', COMMA: ',',
    LESS: '<', GREATER: '>', LESS_EQUAL: '<=', GREATER_EQUAL: '>=',
    IDENTIFIER: /[a-z][a-z\d]*/i, THIS: 'this', DOT: '.',
    NUMBER: [/\d+(\.\d*)?/, (text: string) => parseFloat(text)],
    STRING: [stringScanner, (text: string) => text.substring(1, text.length - 1)],
    PRINT: /print/i, FOR: /for/i, WHILE: /while/i, CLASS: /class/i,
    IF: /if/i, ELSE: /else/i, FUN: /fun/i, RETURN: /return/i,
    _COMMENT: [/\/\/.*/, (text: string) => text.substring(2).trim()],
    _SPACE: /\s+/,
})

class LoxParser<T extends Lexicon> extends Parser<T, Expression> {
    constructor(stream: TokenStream<T>) {
        super(stream)
    }

    private _parsed?: Expression
    parse() {
        if (!this._parsed) this._parsed = this.Expression()
        return this._parsed
    }

    // expression -> equality
    Expression(): Expression { return this.Equality() }

    // equality   -> comparison (("!=" | "==") comparison)*
    Equality(): Expression {
        let expr = this.Comparison()
        while (this.match(Lx.BANG_EQUAL, Lx.EQUAL_EQUAL)) {
            const operator = this.previous()
            const right = this.Comparison()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    // comparison -> term ((">"|"<"|"<="|">=") term)*
    Comparison(): Expression {
        let expr = this.Term()
        while (this.match(Lx.LESS, Lx.GREATER, Lx.LESS_EQUAL, Lx.GREATER_EQUAL)) {
            const operator = this.previous()
            const right = this.Term()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    // term       -> factor (("+"|"-") factor)*
    Term(): Expression {
        let expr = this.Factor()
        while (this.match(Lx.PLUS, Lx.DASH)) {
            const operator = this.previous()
            const right = this.Factor()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    // factor     -> unary (("*"|"/") unary)*
    Factor(): Expression {
        let expr = this.Unary()
        while (this.match(Lx.STAR, Lx.SLASH)) {
            const operator = this.previous()
            const right = this.Unary()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    // unary      -> ("!" | "-") unary | primary
    Unary(): Expression {
        if (this.match(Lx.BANG, Lx.DASH)) {
            const operator = this.previous()
            const right = this.Unary()
            return new Unary(operator, right)
        }
        return this.Primary()
    }

    // primary    -> NUMBER | STRING | TRUE | FALSE | NIL | "(" expression ")"
    Primary(): Expression {
        if (this.match(Lx.NUMBER, Lx.STRING, Lx.TRUE, Lx.FALSE, Lx.NIL)) {
            return new Literal(this.previous().value)
        }
        if (this.match(Lx.LEFT_PAREN)) {
            const expr = this.Expression()
            this.consume(Lx.RIGHT_PAREN, 'Expected ")" after expression')
            return new Grouping(expr)
        }
        throw `Expected expression at ${this.peek()}`
    }
}


abstract class Expression {
    abstract accept(visitor: LoxVisitor): any
}
class Literal implements Expression {
    constructor(
        readonly value: any,
    ) { }
    accept(visit: LoxVisitor) { return visit.Literal(this) }
}
class Unary implements Expression {
    constructor(
        readonly operator: Token<any>,
        readonly right: Expression
    ) { }
    accept(visit: LoxVisitor) { return visit.Unary(this) }
}
class Binary implements Expression {
    constructor(
        readonly left: Expression,
        readonly operator: Token<any>,
        readonly right: Expression
    ) { }
    accept(visit: LoxVisitor) { return visit.Binary(this) }
}
class Grouping implements Expression {
    constructor(
        readonly inner: Expression,
    ) { }
    accept(visit: LoxVisitor) { return visit.Grouping(this) }
}

interface LoxVisitor {
    Literal(expr: Literal): void
    Unary(expr: Unary): void
    Binary(expr: Binary): void
    Grouping(expr: Grouping): void
}

class LoxPrettyPrinter implements LoxVisitor {
    Literal(expr: Literal) { return JSON.stringify(expr.value) }
    Unary(expr: Unary) { return `(${expr.operator.text} ${expr.right.accept(this)})` }
    Binary(expr: Binary) { return `(${expr.operator.text} ${expr.left.accept(this)} ${expr.right.accept(this)})` }
    Grouping(expr: Grouping) { return `${expr.inner.accept(this)}` }
}

class LoxEvaluator implements LoxVisitor {
    Literal(expr: Literal) {
        return JSON.parse(JSON.stringify(expr.value))
    }
    Unary(expr: Unary) {
        const value = expr.right.accept(this)
        if (expr.operator.text == '!') return !value
        if (expr.operator.text == '-') return -value
        throw "Unexpected Unary Operator"
    }
    Binary(expr: Binary) {
        const left = expr.left.accept(this)
        const right = expr.right.accept(this)
        if (expr.operator.text == '+') return left + right
        if (expr.operator.text == '-') return left - right
        if (expr.operator.text == '*') return left * right
        if (expr.operator.text == '/') return left / right
        throw "Unexpected Binary Operator"
    }
    Grouping(expr: Grouping) { return expr.inner.accept(this) }
}


const Lox = new Language(LoxScanner, LoxParser, LoxEvaluator)
new Launcher({
    name: 'lox',
    version,
    Formatters: {
        parse(ast: Expression) { return ast.accept(new LoxPrettyPrinter) }
    }
}).drive(Lox.driver)
