import * as Lib from "./lib";
import * as Ast from "./ast";
import { TOKEN } from "./scanner";

export class Parser extends Lib.Parser<typeof TOKEN, Ast.Expression> {
    private _parsed?: Ast.Expression;
    parse() {
        if (!this._parsed) this._parsed = this.Expression();
        return this._parsed;
    }

    // expression -> comma
    Expression() {
        return this.Comma();
    }

    // comma      -> conditional ("," conditional)*
    Comma() {
        let expr = this.Conditional();
        while (this.match(TOKEN.COMMA)) {
            const comma = this.previous();
            const right = this.Conditional();
            expr = new Ast.Binary(expr, comma, right);
        }
        return expr;
    }

    // conditional -> equality ("?" equality ":" equality)*
    Conditional() {
        let expr = this.Equality();
        while (this.match(TOKEN.QUESTION)) {
            const question = this.previous();
            const middle = this.Equality();
            this.consume(TOKEN.COLON, "Expected :");
            const colon = this.previous();
            const right = this.Equality();
            expr = new Ast.Ternary(expr, question, middle, colon, right);
        }
        return expr;
    }

    // equality   -> comparison (("!=" | "==") comparison)*
    Equality() {
        let expr = this.Comparison();
        while (this.match(TOKEN.BANG_EQUAL, TOKEN.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.Comparison();
            expr = new Ast.Binary(expr, operator, right);
        }
        return expr;
    }

    // comparison -> term ((">"|"<"|"<="|">=") term)*
    Comparison() {
        let expr = this.Term();
        while (
            this.match(
                TOKEN.LESS,
                TOKEN.GREATER,
                TOKEN.LESS_EQUAL,
                TOKEN.GREATER_EQUAL
            )
        ) {
            const operator = this.previous();
            const right = this.Term();
            expr = new Ast.Binary(expr, operator, right);
        }
        return expr;
    }

    // term       -> factor (("+"|"-") factor)*
    Term() {
        let expr = this.Factor();
        while (this.match(TOKEN.PLUS, TOKEN.DASH)) {
            const operator = this.previous();
            const right = this.Factor();
            expr = new Ast.Binary(expr, operator, right);
        }
        return expr;
    }

    // factor     -> unary (("*"|"/") unary)*
    Factor() {
        let expr = this.Unary();
        while (this.match(TOKEN.STAR, TOKEN.SLASH)) {
            const operator = this.previous();
            const right = this.Unary();
            expr = new Ast.Binary(expr, operator, right);
        }
        return expr;
    }

    // unary      -> _invalid_unary* _valid_unary
    Unary() {
        while (this._InvalidUnary()) { }
        return this._ValidUnary();
    }

    // _invalid_unary -> ("+" | "*" | "/") unary | e
    private _InvalidUnary(): Ast.Expression | undefined {
        if (this.match(TOKEN.PLUS, TOKEN.STAR, TOKEN.SLASH)) {
            this.reporter.error(
                this.previous(),
                "Binary operator is missing the left operand"
            );
            this.previous();
            return this.Unary();
        }
        return;
    }

    // _valid_unary > ("!" | "-") unary | primary
    private _ValidUnary(): Ast.Expression {
        if (this.match(TOKEN.BANG, TOKEN.DASH)) {
            const operator = this.previous();
            const right = this.Unary();
            return new Ast.Unary(operator, right);
        }
        return this.Primary();
    }

    // primary    -> NUMBER | STRING | TRUE | FALSE | NIL | "(" expression ")"
    Primary(): Ast.Expression {
        if (
            this.match(TOKEN.NUMBER, TOKEN.STRING, TOKEN.TRUE, TOKEN.FALSE, TOKEN.NIL)
        ) {
            return new Ast.Literal(this.previous().value);
        }
        if (this.match(TOKEN.LEFT_PAREN)) {
            const expr = this.Expression();
            this.consume(TOKEN.RIGHT_PAREN, 'Expected ")" after expression');
            return new Ast.Grouping(expr);
        }
        throw `Expected expression at ${this.peek()}`;
    }

    synchronize() {
        this.advance();
        while (!this.atEnd()) {
            if (this.previous().name == "SEMICOLON") return;
            switch (this.peek().name) {
                case "CLASS":
                case "FOR":
                case "FUN":
                case "IF":
                case "RETURN":
                case "VAR":
                case "WHILE":
                    return;
            }
            this.advance();
        }
    }
}
