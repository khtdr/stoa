declare type RuntimeOpts = {
    stage: "scan" | "parse" | "eval";
};
declare abstract class Language<Tokens extends Lexicon, Ast extends object, Result> {
    readonly reporter: Reporter;
    abstract readonly Tokenizer: typeof TokenStreamClass<Tokens>;
    abstract readonly Parser: typeof Parser<Tokens, Ast>;
    abstract readonly Resolver: typeof Visitor<Ast, void>;
    abstract readonly Interpreter: typeof Visitor<Ast, Result>;
    constructor(reporter?: Reporter);
    private _interpreter?;
    get interpreter(): Visitor<Ast, Result>;
    private _resolver?;
    get resolver(): Visitor<Ast, void>;
    private opts;
    options(opts: RuntimeOpts): void;
    errored: boolean;
    run(name: string, code: string): void;
    private runToStage;
}

declare type Lexeme = string | RegExp | ((text: string, reporter: Reporter, line: number, column: number) => undefined | string);
declare type Lexicon = Record<string, Lexeme>;
declare class Token<Name = string> {
    readonly name: Name;
    readonly text: string;
    readonly pos: {
        line: number;
        column: number;
    };
    constructor(name: Name, text: string, pos: {
        line: number;
        column: number;
    });
    toString(): string;
}
declare class TokenStream<Lx extends Lexicon> {
    readonly reporter: Reporter;
    private generator;
    constructor(source: string, lexicon: Lx, reporter: Reporter, line?: number, column?: number);
    private buffer;
    take(): Token<keyof Lx> | undefined;
    peek(): Token<keyof Lx> | undefined;
    drain(): Token<keyof Lx>[];
    print(tokens?: (Token<keyof Lx> | undefined)[], level?: "error" | "log"): void;
    private eof;
    private next;
}
declare class TokenStreamClass<Lx extends Lexicon> extends TokenStream<Lx> {
    constructor(source: string, reporter: Reporter);
}
declare const Tokens: {
    STRINGS: {
        STD: typeof stringScanner;
    };
    COMMENTS: {
        SHEBANG: RegExp;
        DOUBLE_SLASH: RegExp;
        C_STYLE: typeof cStyleCommentScanner;
    };
    SPACE: {
        ALL: RegExp;
    };
};
declare function cStyleCommentScanner(value: string, reporter: Reporter, line: number, column: number): string | undefined;
declare function stringScanner(value: string, reporter: Reporter, line: number, column: number): string | undefined;

declare class Parser<Lx extends Lexicon, Ast extends object> {
    private readonly tokens;
    protected reporter: Reporter;
    constructor(tokens: Token<keyof Lx>[], reporter: Reporter);
    parse(): Ast | undefined;
    print(ast?: Ast, level?: "error" | "log"): void;
    private current;
    protected match(...names: string[]): boolean;
    protected consume<Name extends keyof Lx>(name: Name, message: string): Token<Name>;
    protected error(message: string): InvalidParseTree;
    protected check(name: keyof Lx): boolean;
    protected atEnd(): boolean;
    protected advance(): Token<keyof Lx>;
    protected peek(ahead?: number): Token<keyof Lx> | undefined;
    protected previous<Name extends keyof Lx = keyof Lx>(): Token<Name>;
}
declare class Visitor<Ast extends object, Result = string> {
    readonly reporter: Reporter;
    readonly interpreter?: any;
    constructor(reporter?: Reporter, interpreter?: any);
    visit(node: Ast): Result;
}
declare class ParseError extends Error {
}
declare class InvalidParseTree extends ParseError {
}
declare class IncompleteParseTree extends ParseError {
}

declare type Errors = [Token, string][];
interface Reporter {
    error(token: Token, message?: string): void;
    pushSource(name: string, source: string): void;
    popSource(): void;
    tokenError(): void;
    parseError(): void;
    runtimeError(): void;
    errors: false | [Token, string][];
}
declare class StdErrReporter implements Reporter {
    private files;
    pushSource(name: string, source: string): void;
    popSource(): void;
    private _errors;
    error(token: Token, message: string): void;
    get errors(): false | Errors;
    tokenError(): void;
    parseError(): void;
    runtimeError(): void;
    private reportErrors;
    protected log(message: string): void;
}

declare class RuntimeError extends Error {
    readonly token: Token;
    constructor(token: Token, message: string);
}

export { IncompleteParseTree, InvalidParseTree, Language, Lexeme, Lexicon, ParseError, Parser, Reporter, RuntimeError, StdErrReporter, Token, TokenStream, TokenStreamClass, Tokens, Visitor };
