import * as Lib from ".";

export class Parser<Lx extends Lib.Lexicon, Ast extends object> {
  constructor(
    private readonly tokens: Lib.Token<keyof Lx>[],
    protected reporter: Lib.Reporter
  ) {}

  parse(): Ast | undefined {
    return undefined;
  }
  print(ast?: Ast, level: "error" | "log" = "log") {
    console[level](`${ast ?? ""}`);
  }

  private current = 0;

  protected match(...names: string[]): boolean {
    for (const name of names) {
      if (this.check(name)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  protected consume<Name extends keyof Lx>(
    name: Name,
    message: string
  ): Lib.Token<Name> {
    if (this.check(name)) return this.advance() as Lib.Token<typeof name>;
    throw this.error(message);
  }

  protected error(message: string, token?: Lib.Token<any>) {
    let tk: Lib.Token<any> = token || this.peek() || this.previous();
    let error = new InvalidParseTree(message);
    if (!this.peek()) {
      const lines = tk.text.split("\n");
      const addLines = lines.length - 1;
      const line = tk.pos.line + addLines;
      const column = addLines
        ? lines[lines.length - 1].length + 1
        : tk.pos.column + tk.text.length;
      tk = new Lib.Token("<EOF>", "", { line, column });
      error = new IncompleteParseTree(message);
    }
    this.reporter.error(tk, message);
    return error;
  }

  protected check(name: keyof Lx): boolean {
    return this.peek()?.name == name;
  }

  protected atEnd(): boolean {
    return !this.peek()?.name;
  }

  protected advance(): Lib.Token<keyof Lx> {
    if (!this.atEnd()) this.current++;
    return this.previous();
  }

  protected peek(ahead = 1): Lib.Token<keyof Lx> | undefined {
    return this.tokens[this.current + (ahead - 1)];
  }

  protected previous<Name extends keyof Lx = keyof Lx>(): Lib.Token<Name> {
    return this.tokens[this.current - 1] as Lib.Token<Name>;
  }
}

export class Visitor<Ast extends object, Result = string> {
  constructor(
    readonly reporter: Lib.Reporter = new Lib.StdErrReporter(),
    readonly interpreter?: any
  ) {}
  visit(node: Ast): Result {
    const name = node.constructor.name;
    const fn = this[name as keyof this];
    if (typeof fn == "function") return fn.bind(this)(node);
    throw new Error(`Unvisitable node: ${name} (UNIMPLEMENTED BY AUTHOR)`);
  }
}

export class ParseError extends Error {}
// TODO the repl can use these to quit an input vs prompt more lines
export class InvalidParseTree extends ParseError {}
export class IncompleteParseTree extends ParseError {}
