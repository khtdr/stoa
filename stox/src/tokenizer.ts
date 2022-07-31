import * as Ltk from "stoa-ltk";

export class Tokenizer extends Ltk.TokenStream<typeof Tokenizer.lexicon> {
        static readonly lexicon = {
                // literals
                FALSE: /false/i,
                NIL: /nil/,
                NUMBER: /\d+(\.\d+)?/,
                STRING: Ltk.Tokens.STRINGS.STD,
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
                _SHEBANG_COMMENT: Ltk.Tokens.COMMENTS.SHEBANG,
                _MULTI_LINE_COMMENT: Ltk.Tokens.COMMENTS.C_STYLE,
                _SINGLE_LINE_COMMENT: Ltk.Tokens.COMMENTS.DOUBLE_SLASH,
                _SPACE: Ltk.Tokens.SPACE.ALL,
        };

        constructor(source: string, reporter: Ltk.Reporter) {
                super(source, Tokenizer.lexicon, reporter);
        }
}

type TokenName = keyof typeof Tokenizer.lexicon;

export const TOKEN = (Object.keys(Tokenizer.lexicon) as TokenName[]).reduce(
        (a, c) => ((a[c] = c), a),
        {} as Record<string, string>
) as { [key in TokenName]: key };

export type Token<T extends TokenName = TokenName> = Ltk.Token<T>;
