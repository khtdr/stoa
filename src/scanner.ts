import { TokenStreamClassFactory, TokenStream, Token, StdReporter } from "./lib";

export const Scanner = TokenStreamClassFactory.buildTokenStreamClass({
    // literals
    FALSE: "false",
    IDENTIFIER: /[a-z][a-z\d]*/i,
    NIL: "nil",
    NUMBER: [/\d+(\.\d+)?/, (text) => parseFloat(text)],
    STRING: [stringScanner, (text) => {
        if (['"', "'"].includes(text.substring(text.length - 1)))
            return text.replace(/^.(.*).$/, "$1")
        return text.replace(/^.(.*)$/, "$1")
    }],
    TRUE: "true",

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
    SUPER: /super/i,
    VAR: /var/i,
    THIS: /this/i,
    FOR: /for/i,
    WHILE: /while/i,
    CLASS: /class/i,
    IF: /if/i,
    ELSE: /else/i,
    FUN: /fun/i,
    RETURN: /return/i,

    // discarded
    _MULTI_LINE_COMMENT: cStyleCommentScanner,
    _SINGLE_LINE_COMMENT: [/\/\/.*/, (text) => text.substring(2).trim()],
    _SPACE: /\s+/,
});

export const TOKEN = Scanner.TOKENS;

function stringScanner(value: string, reporter = new StdReporter()) {
    const tokenizer = new TokenStream(value, {
        SINGLE: "'",
        DOUBLE: '"',
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    });
    const opener = tokenizer.take();
    if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
        let { text } = opener,
            closer: Token | undefined;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == opener.name) return text;
        }
        reporter.error(opener, `Expected to find a closing ${opener.text} for the string at ${opener.pos.line}:${opener.pos.column}`);
        return text;
    }
}

function cStyleCommentScanner(value: string, reporter = new StdReporter()) {
    const tokenizer = new TokenStream(value, {
        OPEN: "/*",
        CLOSE: "*/",
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    });
    const opener = tokenizer.take();
    if (opener && opener.name == "OPEN") {
        let stack = 0,
            closer: Token | undefined,
            text = opener.text;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == "OPEN") stack += 1;
            else if (closer.name == "CLOSE") {
                if (!stack) return text;
                else stack -= 1;
            }
        }
        reporter.error(opener, `Expected to find a closing ${opener.text} for the comment at ${opener.pos.line}:${opener.pos.column}`);
        return text;
    }
}
