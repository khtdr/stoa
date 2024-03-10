import * as Ltk from "stoa-ltk";
import { TOKEN } from "./tokenizer";
import { Printer } from "./printer";
import * as Decl from "./ast/declarations";
import * as Expr from "./ast/expressions";
import * as Node from "./ast/nodes";
import * as Stmt from "./ast/statements";

export class Parser extends Ltk.Parser<typeof TOKEN, Node.Ast> {
    private _parsed?: Node.Ast;
    parse() {
        if (!this._parsed) this._parsed = this.Program();
        return this._parsed;
    }
    toString() {
        if (!this._parsed) return "un-parsed";
        return new Printer().visit(this._parsed);
    }
    print(ast = this._parsed, level: "error" | "log" = "log") {
        const message = !ast ? "()" : new Printer().visit(ast);
        console[level](message);
    }

    // program -> declaration* EOF
    Program() {
        const declarations: Node.Statement[] = [];
        while (!this.atEnd()) {
            const decl = this.Declaration();
            if (decl) declarations.push(decl);
        }
        return new Node.Program(declarations);
    }

    // declaration -> fun_declaration | var_declaration | statement
    Declaration() {
        try {
            // second part is to allow anonymouse function expression in Primary
            if (
                this.peek()?.name == TOKEN.FUN &&
                this.peek(2)?.name == TOKEN.IDENTIFIER
            ) {
                this.match(TOKEN.FUN);
                return this.FunDeclaration();
            }
            if (this.match(TOKEN.CLASS)) {
                return this.ClassDeclaration();
            }
            if (this.match(TOKEN.VAR)) {
                return this.VarDeclaration();
            }
            return this.Statement();
        } catch (err) {
            if (err instanceof Ltk.ParseError) {
                this.synchronize();
                return;
            } else throw err;
        }
    }

    // class_declaration -> IDENTIFIER "{" fun_declaration* "}"
    ClassDeclaration(): Decl.ClassDecl {
        const ident = this.consume("IDENTIFIER", "Expected identifier");
        this.consume(TOKEN.LEFT_CURL, 'Expected "{"');
        const funs: Decl.FunctionDecl[] = [];
        while (true) {
            const fun = this.FunDeclaration();
            if (!fun) break;
            funs.push(fun);
        }
        this.consume(TOKEN.RIGHT_CURL, 'Expected "}"');
        return new Decl.ClassDecl(ident, funs);
    }

    // fun_declaration -> IDENTIFIER function
    FunDeclaration(): Decl.FunctionDecl | void {
        if (this.peek()?.name == TOKEN.IDENTIFIER) {
            const ident = this.consume("IDENTIFIER", "Expected identifier");
            const fun = this.FunctionExpr();
            return new Decl.FunctionDecl(ident, fun);
        }
    }

    // function -> "(" parameters? ")" block
    FunctionExpr(): Expr.FunctionExpr {
        this.consume(TOKEN.LEFT_PAREN, "Expected (");
        const parameters = this.Parameters();
        this.consume(TOKEN.RIGHT_PAREN, "Expected )");
        const block = this.Block();
        if (!block) throw this.error("Expected {");
        return new Expr.FunctionExpr(parameters, block);
    }

    // parameters -> IDENTIFER ("," IDENTIFIER)*
    Parameters(): Ltk.Token<"IDENTIFIER">[] {
        const params: Ltk.Token<"IDENTIFIER">[] = [];
        if (this.peek()?.name != TOKEN.RIGHT_PAREN) {
            if (params.length >= 255) this.error("Too many params (255 max)");
            do {
                const id = this.consume(
                    TOKEN.IDENTIFIER,
                    "expected param name"
                );
                params.push(id as Ltk.Token<"IDENTIFIER">);
            } while (this.peek()?.name == TOKEN.COMMA);
        }
        return params;
    }

    // var_declaration -> "var" IDENTIFIER ("=" expression)? ";"
    VarDeclaration(): Decl.VariableDecl {
        const ident = this.consume("IDENTIFIER", "Expected identifier");
        let expr: Node.Expression | undefined;
        if (this.match(TOKEN.EQUAL)) {
            expr = this.Expression();
        }
        this.consume(TOKEN.SEMICOLON, "Expected ;");
        return new Decl.VariableDecl(ident, expr);
    }

    // statement -> return_statement | print_statement | if_statement | while_statement |
    //              for_statement | jump_statement | block | expressiont_statement
    Statement(): Node.Statement {
        return (
            this.PrintStatement() ||
            this.ReturnStatement() ||
            this.IfStatement() ||
            this.WhileStatement() ||
            this.ForStatement() ||
            this.JumpStatement() ||
            this.Block() ||
            this.ExpressionStatement()
        );
    }

    ReturnStatement(): Stmt.ReturnStmt | void {
        if (this.match(TOKEN.RETURN)) {
            const keyword = this.previous<"RETURN">();
            let expr: Node.Expression = new Expr.LiteralExpr(undefined);
            if (!this.match(TOKEN.SEMICOLON)) {
                expr = this.Expression();
                this.consume(TOKEN.SEMICOLON, "Expected ;");
            }
            return new Stmt.ReturnStmt(expr, keyword);
        }
    }

    // block -> "{" declaration* "}"
    Block(): Stmt.BlockStmt | void {
        if (this.match(TOKEN.LEFT_CURL)) {
            const declarations: Node.Declaration[] = [];
            while (!this.atEnd() && this.peek()?.name != TOKEN.RIGHT_CURL) {
                const decl = this.Declaration();
                if (decl) declarations.push(decl);
            }
            const block = new Stmt.BlockStmt(declarations);
            this.consume(TOKEN.RIGHT_CURL, "Expected }");
            return block;
        }
    }

    // jump_statement -> ("break" | "continue") expression? ";"
    JumpStatement(): Stmt.JumpStmt | void {
        if (this.match(TOKEN.BREAK, TOKEN.CONTINUE)) {
            const jump = this.previous<"CONTINUE" | "BREAK">();
            let expr: Node.Expression = new Expr.LiteralExpr([1, 0]);
            if (this.peek()?.name != TOKEN.SEMICOLON) expr = this.Expression();
            this.consume(TOKEN.SEMICOLON, "Expected ;");
            return new Stmt.JumpStmt(jump, expr);
        }
    }

    // if_statement -> "if" "(" expression ")" statement ("else" statement)?
    IfStatement(): Stmt.IfStmt | void {
        if (this.match(TOKEN.IF)) {
            this.consume(TOKEN.LEFT_PAREN, "Expected (");
            const cond = this.Expression();
            this.consume(TOKEN.RIGHT_PAREN, "Expected )");
            const trueStatement = this.Statement();
            if (this.match(TOKEN.ELSE)) {
                const falseStatement = this.Statement();
                return new Stmt.IfStmt(cond, trueStatement, falseStatement);
            } else {
                return new Stmt.IfStmt(cond, trueStatement);
            }
        }
    }

    // while_statement -> "while" "(" expression ")" statement
    WhileStatement(): Stmt.WhileStmt | void {
        if (this.match(TOKEN.WHILE)) {
            this.consume(TOKEN.LEFT_PAREN, "Expected (");
            const cond = this.Expression();
            this.consume(TOKEN.RIGHT_PAREN, "Expected )");
            const body = this.Statement();
            return new Stmt.WhileStmt(cond, body);
        }
    }

    // for_statement -> "for" "(" var_decl | exprStmt | ";" expression? ";" expression? ")" statement
    ForStatement(): Stmt.BlockStmt | void {
        if (this.match(TOKEN.FOR)) {
            this.consume(TOKEN.LEFT_PAREN, "Expected (");
            const init =
                (this.match(TOKEN.VAR) && this.VarDeclaration()) ||
                this.ExpressionStatement() ||
                (this.consume(TOKEN.SEMICOLON, "Expected ;") &&
                    new Expr.LiteralExpr(true));
            let cond: Node.Expression = new Expr.LiteralExpr(true);
            if (this.peek()?.name != TOKEN.SEMICOLON) cond = this.Expression();
            this.consume(TOKEN.SEMICOLON, "Expected ;");
            let incr: Node.Expression = new Expr.LiteralExpr(true);
            if (this.peek()?.name != TOKEN.RIGHT_PAREN)
                incr = this.Expression();
            this.consume(TOKEN.RIGHT_PAREN, "Expected )");
            const body_statement = this.Statement();
            return new Stmt.BlockStmt([
                init,
                new Stmt.WhileStmt(
                    cond,
                    new Stmt.BlockStmt([
                        body_statement,
                        new Stmt.ExpressionStmt(incr),
                    ])
                ),
            ]);
        }
    }

    // print_statement -> "print" expression ";"
    PrintStatement(): Stmt.PrintStmt | void {
        if (this.match(TOKEN.PRINT)) {
            const expr = this.Expression();
            this.consume(TOKEN.SEMICOLON, "Expected ;");
            return new Stmt.PrintStmt(expr);
        }
    }

    // expression_statement -> expression ";"
    ExpressionStatement(): Stmt.ExpressionStmt {
        const expr = this.Expression();
        this.consume(TOKEN.SEMICOLON, "Expected ;");
        return new Stmt.ExpressionStmt(expr);
    }

    // expression -> comma
    Expression(): ReturnType<typeof this.Comma> {
        return this.Comma();
    }

    // comma -> assignment ("," assignment)*
    Comma(): ReturnType<typeof this.Assignment> | Expr.BinaryExpr {
        let expr = this.Assignment();
        while (this.match(TOKEN.COMMA)) {
            const comma = this.previous();
            const right = this.Assignment();
            expr = new Expr.BinaryExpr(expr, comma, right);
        }
        return expr;
    }

    // assignment -> IDENTIFIER "=" assignment | logic_or
    Assignment(): ReturnType<typeof this.LogicOr> | Expr.AssignExpr {
        const expr = this.LogicOr();
        if (this.match(TOKEN.EQUAL)) {
            const eq = this.previous();
            const value = this.Assignment();
            if (expr instanceof Expr.VariableExpr) {
                return new Expr.AssignExpr(expr.name, value);
            } else if (expr instanceof Expr.GetExpr) {
                return new Expr.SetExpr(expr.name, expr.expr, value);
            }
            this.error("Invalid assignment target", eq);
        }
        return expr;
    }

    // logic_or -> logic_and ("or" logic_and)*
    LogicOr(): ReturnType<typeof this.LogicAnd> | Expr.LogicalExpr {
        let expr = this.LogicAnd();
        while (this.match(TOKEN.OR)) {
            const or = this.previous();
            const right = this.LogicAnd();
            expr = new Expr.LogicalExpr(expr, or, right);
        }
        return expr;
    }

    // logic_and -> conditional ("and" conditional)*
    LogicAnd(): ReturnType<typeof this.Conditional> | Expr.LogicalExpr {
        let expr = this.Conditional();
        while (this.match(TOKEN.AND)) {
            const and = this.previous();
            const right = this.Conditional();
            expr = new Expr.LogicalExpr(expr, and, right);
        }
        return expr;
    }

    // conditional -> equality ("?" equality ":" equality)*
    Conditional(): ReturnType<typeof this.Equality> | Expr.TernaryExpr {
        let expr: ReturnType<typeof this.Equality> | Expr.TernaryExpr =
            this.Equality();
        while (this.match(TOKEN.QUESTION)) {
            const question = this.previous();
            const middle = this.Equality();
            this.consume(TOKEN.COLON, "Expected :");
            const colon = this.previous();
            const right = this.Equality();
            expr = new Expr.TernaryExpr(expr, question, middle, colon, right);
        }
        return expr;
    }

    // equality -> comparison (("!=" | "==") comparison)*
    Equality(): ReturnType<typeof this.Comparison> | Expr.BinaryExpr {
        let expr = this.Comparison();
        while (this.match(TOKEN.BANG_EQUAL, TOKEN.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.Comparison();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    // comparison -> term ((">"|"<"|"<="|">=") term)*
    Comparison(): ReturnType<typeof this.Term> | Expr.BinaryExpr {
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
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    // term -> factor (("+"|"-") factor)*
    Term(): ReturnType<typeof this.Factor> | Expr.BinaryExpr {
        let expr = this.Factor();
        while (this.match(TOKEN.PLUS, TOKEN.DASH)) {
            const operator = this.previous();
            const right = this.Factor();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    // factor -> unary (("*"|"/") unary)*
    Factor(): ReturnType<typeof this.Unary> | Expr.BinaryExpr {
        let expr: ReturnType<typeof this.Unary> | Expr.BinaryExpr =
            this.Unary();
        while (this.match(TOKEN.STAR, TOKEN.SLASH)) {
            const operator = this.previous();
            const right = this.Unary();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    // unary -> _invalid_unary* _valid_unary
    Unary(): ReturnType<typeof this._ValidUnary> {
        while (this._InvalidUnary()) {}
        return this._ValidUnary();
    }

    // _invalid_unary -> ("+" | "*" | "/") unary | e
    private _InvalidUnary(): ReturnType<typeof this._ValidUnary> | undefined {
        if (this.match(TOKEN.PLUS, TOKEN.STAR, TOKEN.SLASH)) {
            this.error(
                "Binary operator is missing the left operand",
                this.previous()
            );
            this.previous();
            return this.Unary();
        }
        return;
    }

    // _valid_unary -> ("!" | "-") unary | call
    private _ValidUnary(): Expr.UnaryExpr | ReturnType<typeof this.Call> {
        if (this.match(TOKEN.BANG, TOKEN.DASH)) {
            const operator = this.previous();
            const right = this.Unary();
            return new Expr.UnaryExpr(operator, right);
        }
        return this.Call();
    }

    // call -> primary ("(" (expression ("," expression)*)? ")")*
    Call(): ReturnType<typeof this.Primary> | Expr.CallExpr {
        let expr: Expr.CallExpr | ReturnType<typeof this.Primary> =
            this.Primary();
        while (true) {
            if (this.match(TOKEN.LEFT_PAREN)) {
                const args: Node.Expression[] = [];
                if (!this.check(TOKEN.RIGHT_PAREN)) {
                    if (args.length >= 255)
                        this.error("Too many args (255 max)");
                    do {
                        args.push(this.Expression());
                    } while (this.match(TOKEN.COMMA));
                }
                const paren = this.consume(
                    TOKEN.RIGHT_PAREN,
                    "Expected ) after arguments"
                );
                expr = new Expr.CallExpr(expr, args, paren);
            } else if (this.match(TOKEN.DOT)) {
                const name = this.consume(
                    TOKEN.IDENTIFIER,
                    "Expected method or attribute name"
                );
                expr = new Expr.GetExpr(name, expr);
            } else break;
        }
        return expr;
    }

    // primary    -> IDENTIFIER | NUMBER | STRING | TRUE | FALSE | NIL |
    //               "this" | "(" expression ")" | "fun" function
    Primary():
        | Expr.LiteralExpr
        | Expr.VariableExpr
        | Expr.GroupExpr
        | Expr.FunctionExpr {
        if (this.match(TOKEN.NUMBER)) {
            const numStr = this.previous<"NUMBER">().text;
            const value = parseFloat(numStr);
            const precision = `${numStr}.`.split(".")[1].length;
            return new Expr.LiteralExpr([value, precision]);
        }
        if (this.match(TOKEN.STRING)) {
            const str = this.previous<"STRING">().text;
            const [first, ...rest] = str.split("");
            if (first === rest[rest.length - 1]) rest.pop();
            return new Expr.LiteralExpr(rest.join(""));
        }
        if (this.match(TOKEN.TRUE)) {
            return new Expr.LiteralExpr(true);
        }
        if (this.match(TOKEN.FALSE)) {
            return new Expr.LiteralExpr(false);
        }
        if (this.match(TOKEN.NIL)) {
            return new Expr.LiteralExpr(undefined);
        }
        if (this.match(TOKEN.THIS)) {
            return new Expr.ThisExpr(this.previous())
        }
        if (this.match(TOKEN.IDENTIFIER)) {
            return new Expr.VariableExpr(this.previous());
        }
        if (this.match(TOKEN.LEFT_PAREN)) {
            const expr = this.Expression();
            this.consume(TOKEN.RIGHT_PAREN, 'Expected ")" after expression');
            return new Expr.GroupExpr(expr);
        }
        if (this.match(TOKEN.FUN)) {
            return this.FunctionExpr();
        }
        throw this.error("Expected to find an expression");
    }

    synchronize() {
        this.advance();
        while (!this.atEnd()) {
            if (this.previous().name == "SEMICOLON") return;
            switch (this.peek()?.name ?? "") {
                case "CLASS":
                case "FOR":
                case "FUN":
                case "IF":
                case "PRINT":
                case "RETURN":
                case "VAR":
                case "WHILE":
                    return;
            }
            this.advance();
        }
    }
}
