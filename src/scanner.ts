import * as Lib from "./lib";

export const Scanner = Lib.TokenStreamClassFactory.buildTokenStreamClass({
    // literals
    FALSE: /false/i,
    NIL: /nil/,
    NUMBER: /\d+(\.\d+)?/,
    STRING: Lib.Tokens.STRINGS.STD,
    TRUE: /true/i,
    IDENTIFIER: /[a-z][a-z\d]*/i,

    // operators
    AND: /and/i,
    BANG: "!",
    BANG_EQUAL: "!=",
    DASH: "-",
    EQUAL: "=",
    EQUAL_EQUAL: "==",
    GREATER: ">",
    GREATER_EQUAL: ">=",
    LESS: "<",
    LESS_EQUAL: "<=",
    NOT: /not/i,
    OR: /or/i,
    PLUS: "+",
    SLASH: "/",
    STAR: "*",

    // puncuation
    COLON: ":",
    COMMA: ",",
    DOT: ".",
    LEFT_CURL: "{",
    LEFT_PAREN: "(",
    QUESTION: "?",
    RIGHT_CURL: "}",
    RIGHT_PAREN: ")",
    SEMICOLON: ";",

    // keywords
    BREAK: /break/i,
    CLASS: /class/i,
    CONTINUE: /continue/i,
    ELSE: /else/i,
    FOR: /for/i,
    FUN: /fun/i,
    IF: /if/i,
    PRINT: /print/i,
    RETURN: /return/i,
    SUPER: /super/i,
    THIS: /this/i,
    VAR: /var/i,
    WHILE: /while/i,

    // discarded
    _SHEBANG_COMMENT: Lib.Tokens.COMMENTS.SHEBANG,
    _MULTI_LINE_COMMENT: Lib.Tokens.COMMENTS.C_STYLE,
    _SINGLE_LINE_COMMENT: Lib.Tokens.COMMENTS.DOUBLE_SLASH,
    _SPACE: Lib.Tokens.SPACE.ALL
});

export const TOKEN = Scanner.TOKENS;
export type Token<T extends keyof typeof TOKEN> = Lib.Token<T>
