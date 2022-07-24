import * as Lib from "./lib";

export const Scanner = Lib.TokenStreamClassFactory.buildTokenStreamClass({
    // literals
    FALSE: /false/i,
    NIL: /nil/,
    NUMBER: /\d+(\.\d+)?/,
    STRING: stringScanner,
    // STRING: [stringScanner, (text) => {
    //     if (['"', "'"].includes(text.substring(text.length - 1)))
    //         return text.replace(/^.(.*).$/, "$1")
    //     return text.replace(/^.(.*)$/, "$1")
    // }],
    TRUE: /true/i,

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

    // gotsta go last, could be better
    IDENTIFIER: /[a-z][a-z\d]*/i,

    // discarded
    _MULTI_LINE_COMMENT: cStyleCommentScanner,
    _SINGLE_LINE_COMMENT: /\/\/.*/,
    _SHEBANG_COMMENT: /\#\!\/usr\/bin\/env\s.*/,
    _SPACE: /\s+/,
});

export const TOKEN = Scanner.TOKENS;
export type Token<T extends keyof typeof TOKEN> = Lib.Token<T>

function stringScanner(value: string, reporter = new Lib.StdReporter()) {
    const tokenizer = new Lib.TokenStream(value, {
        SINGLE: "'",
        DOUBLE: '"',
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    });
    const opener = tokenizer.take();
    if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
        let { text } = opener,
            closer: Lib.Token | undefined;
        while ((closer = tokenizer.take())) {
            text += closer.text;
            if (closer.name == opener.name) return text;
        }
        reporter.error(opener, `Expected to find a closing ${opener.text} for the string at ${opener.pos.line}:${opener.pos.column}`);
        return text;
    }
}

function cStyleCommentScanner(value: string, reporter = new Lib.StdReporter()) {
    const tokenizer = new Lib.TokenStream(value, {
        OPEN: "/*",
        CLOSE: "*/",
        ESCAPED_CHAR: /\\./,
        CHAR: /.|\s/,
    });
    const opener = tokenizer.take();
    if (opener && opener.name == "OPEN") {
        let stack = 0,
            closer: Lib.Token | undefined,
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
