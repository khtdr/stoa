"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/stoa-ltk/index.ts
var stoa_ltk_exports = {};
__export(stoa_ltk_exports, {
  IncompleteParseTree: () => IncompleteParseTree,
  InvalidParseTree: () => InvalidParseTree,
  Language: () => Language,
  ParseError: () => ParseError,
  Parser: () => Parser,
  RuntimeError: () => RuntimeError,
  StdErrReporter: () => StdErrReporter,
  Token: () => Token,
  TokenStream: () => TokenStream,
  TokenStreamClass: () => TokenStreamClass,
  Tokens: () => Tokens,
  Visitor: () => Visitor
});
module.exports = __toCommonJS(stoa_ltk_exports);

// lib/stoa-ltk/language.ts
var Language = class {
  constructor(reporter = new StdErrReporter()) {
    this.reporter = reporter;
    this.opts = { stage: "eval" };
    this.errored = false;
  }
  get interpreter() {
    if (!this._interpreter)
      this._interpreter = new this.Interpreter(this.reporter);
    return this._interpreter;
  }
  get resolver() {
    if (!this._resolver)
      this._resolver = new this.Resolver(this.reporter, this.interpreter);
    return this._resolver;
  }
  options(opts) {
    this.opts = opts;
  }
  run(name, code) {
    this.errored = false;
    this.reporter.pushSource(name, code);
    this.runToStage(code);
    this.reporter.popSource();
  }
  runToStage(source) {
    const scanner = new this.Tokenizer(source, this.reporter);
    const tokens = scanner.drain();
    if (this.reporter.errors) {
      this.errored = true;
      this.reporter.tokenError();
    }
    if (this.opts.stage === "scan") {
      scanner.print(tokens);
      return;
    }
    const parser = new this.Parser(tokens, this.reporter);
    const ast = parser.parse();
    if (this.reporter.errors) {
      this.errored = true;
      this.reporter.parseError();
      return;
    }
    if (!ast)
      return;
    this.resolver.visit(ast);
    if (this.reporter.errors) {
      this.errored = true;
      this.reporter.parseError();
      return;
    }
    if (this.opts.stage == "parse") {
      parser.print(ast);
      return;
    }
    if (this.errored) {
      return;
    }
    this.interpreter.visit(ast);
    if (this.reporter.errors) {
      this.errored = true;
      this.reporter.runtimeError();
    }
  }
};

// lib/stoa-ltk/tokenizer.ts
var ERROR_TOKEN = "__stoa__::error";
var Token = class {
  constructor(name, text, pos) {
    this.name = name;
    this.text = text;
    this.pos = pos;
  }
  toString() {
    const pos = `[${this.pos.line},${this.pos.column}]`;
    return `${this.name}${pos}`;
  }
};
var TokenStream = class {
  constructor(source, lexicon, reporter, line = 1, column = 1) {
    this.reporter = reporter;
    this.buffer = [];
    this.eof = false;
    this.generator = tokenGenerator(source, lexicon, reporter, line, column);
  }
  take() {
    this.peek();
    return this.buffer.shift();
  }
  peek() {
    if (!this.buffer.length)
      this.buffer.push(this.next());
    return this.buffer[0];
  }
  drain() {
    let token, tokens = [];
    while (token = this.take())
      tokens.push(token);
    return tokens;
  }
  print(tokens = this.buffer, level = "log") {
    console[level](tokens.map((t) => `${t}`).join("\n"));
  }
  next() {
    while (true) {
      if (this.eof)
        return;
      const token = this.generator.next().value;
      if (!token) {
        this.eof = true;
        continue;
      }
      if (token.name == ERROR_TOKEN) {
        this.reporter.error(token, `Unrecognized input`);
        continue;
      }
      if (token.name.toString().startsWith("_")) {
        continue;
      }
      return token;
    }
  }
};
var TokenStreamClass = class extends TokenStream {
  constructor(source, reporter) {
    super(source, {}, reporter);
  }
};
function* tokenGenerator(source, lexicon, reporter, start_line, start_column) {
  let idx = 0, line = start_line, column = start_column;
  while (idx < source.length) {
    const [name = ERROR_TOKEN, text = source[idx]] = longest(possible());
    const token = new Token(name, text, pos());
    const lines = text.split("\n").length;
    if (lines > 1) {
      line += lines - 1;
      column = text.length - text.lastIndexOf("\n");
    } else
      column += text.length;
    idx += text.length;
    yield token;
  }
  function pos() {
    return { line, column };
  }
  function longest(candidates) {
    if (!candidates.length)
      return [];
    if (candidates.length == 1)
      return candidates[0];
    return candidates.reduce((longest2, current) => {
      if (current[1].length > longest2[1].length)
        return current;
      if (current[1].length == longest2[1].length)
        return !current[2] && longest2[2] ? current : longest2;
      return longest2;
    });
  }
  function possible() {
    const candidates = [];
    Object.entries(lexicon).map(([name, rule]) => {
      if (typeof rule == "function") {
        const text = rule(source.substring(idx), reporter, line, column);
        if (text !== void 0)
          candidates.push([name, text, false]);
      } else if (typeof rule != "string") {
        const dynamic = rule.source[rule.source.length - 1] == "*";
        const regex = new RegExp(`^${rule.source}`, rule.flags);
        const match = regex.exec(source.substring(idx));
        if (match)
          return candidates.push([name, match[0], dynamic]);
      } else if (source.substring(idx, idx + rule.length) == rule) {
        return candidates.push([name, rule, false]);
      }
    });
    return candidates;
  }
}
var Tokens = {
  STRINGS: {
    STD: stringScanner
  },
  COMMENTS: {
    SHEBANG: /\#\!\/usr\/bin\/env\s.*/,
    DOUBLE_SLASH: /\/\/.*/,
    C_STYLE: cStyleCommentScanner
  },
  SPACE: {
    ALL: /\s+/
  }
};
function cStyleCommentScanner(value, reporter, line, column) {
  const tokenizer = new TokenStream(value, {
    OPEN: "/*",
    CLOSE: "*/",
    ESCAPED_CHAR: /\\./,
    CHAR: /.|\s/
  }, reporter, line, column);
  const opener = tokenizer.take();
  if (opener && opener.name == "OPEN") {
    let stack = 0, closer, text = opener.text;
    while (closer = tokenizer.take()) {
      text += closer.text;
      if (closer.name == "OPEN")
        stack += 1;
      else if (closer.name == "CLOSE") {
        if (!stack)
          return text;
        else
          stack -= 1;
      }
    }
    reporter.error(opener, `Unclosed comment`);
    return text;
  }
}
function stringScanner(value, reporter, line, column) {
  const tokenizer = new TokenStream(value, {
    SINGLE: "'",
    DOUBLE: '"',
    ESCAPED_CHAR: /\\./,
    CHAR: /.|\s/
  }, reporter, line, column);
  const opener = tokenizer.take();
  if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
    let { text } = opener, closer;
    while (closer = tokenizer.take()) {
      text += closer.text;
      if (closer.name == opener.name)
        return text;
    }
    reporter.error(opener, `Unclosed string, expected ${opener.text}`);
    return text;
  }
}

// lib/stoa-ltk/parser.ts
var Parser = class {
  constructor(tokens, reporter) {
    this.tokens = tokens;
    this.reporter = reporter;
    this.current = 0;
  }
  parse() {
    return void 0;
  }
  print(ast, level = "log") {
    console[level](`${ast ?? ""}`);
  }
  match(...names) {
    for (const name of names) {
      if (this.check(name)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  consume(name, message) {
    if (this.check(name))
      return this.advance();
    throw this.error(message);
  }
  error(message) {
    let token = this.peek() || this.previous();
    let error = new InvalidParseTree(message);
    if (!this.peek()) {
      const lines = token.text.split("\n");
      const addLines = lines.length - 1;
      const line = token.pos.line + addLines;
      const column = addLines ? lines[lines.length - 1].length + 1 : token.pos.column + token.text.length;
      token = new Token("<EOF>", "", { line, column });
      error = new IncompleteParseTree(message);
    }
    this.reporter.error(token, message);
    return error;
  }
  check(name) {
    var _a;
    return ((_a = this.peek()) == null ? void 0 : _a.name) == name;
  }
  atEnd() {
    var _a;
    return !((_a = this.peek()) == null ? void 0 : _a.name);
  }
  advance() {
    if (!this.atEnd())
      this.current++;
    return this.previous();
  }
  peek(ahead = 1) {
    return this.tokens[this.current + (ahead - 1)];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
};
var Visitor = class {
  constructor(reporter = new StdErrReporter(), interpreter) {
    this.reporter = reporter;
    this.interpreter = interpreter;
  }
  visit(node) {
    const name = node.constructor.name;
    const fn = this[name];
    if (typeof fn == "function")
      return fn.bind(this)(node);
    throw new Error(`Unvisitable node: ${name} (UNIMPLEMENTED BY AUTHOR)`);
  }
};
var ParseError = class extends Error {
};
var InvalidParseTree = class extends ParseError {
};
var IncompleteParseTree = class extends ParseError {
};

// lib/stoa-ltk/reporter.ts
var StdErrReporter = class {
  constructor() {
    this.files = [];
    this._errors = [];
  }
  pushSource(name, source) {
    this.files.push([name, source]);
  }
  popSource() {
    this.files.pop();
  }
  error(token, message) {
    this._errors.push([token, message]);
  }
  get errors() {
    return !this._errors.length ? false : this._errors;
  }
  tokenError() {
    this.reportErrors("Syntax");
  }
  parseError() {
    this.reportErrors("Parse");
  }
  runtimeError() {
    this.reportErrors("Runtime");
  }
  reportErrors(type) {
    const [name, source] = this.files[this.files.length - 1];
    const lines = source.split("\n");
    for (const [token, message] of this._errors) {
      this.log(`${type} error in ${name} at line,col ${token.pos.line},${token.pos.column}`);
      const prefix = `${token.pos.line}. `;
      const code = `${lines[token.pos.line - 1]}`;
      this.log(`${prefix}${code}`);
      const spaces = `${prefix}${code}`.replace(/./g, " ");
      const arr = spaces.substring(0, prefix.length + token.pos.column - 1);
      this.log(`${arr}\u2191`);
      this.log(`${message}`);
    }
    this._errors = [];
  }
  log(message) {
    console.error(message);
  }
};

// lib/stoa-ltk/runtime.ts
var RuntimeError = class extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IncompleteParseTree,
  InvalidParseTree,
  Language,
  ParseError,
  Parser,
  RuntimeError,
  StdErrReporter,
  Token,
  TokenStream,
  TokenStreamClass,
  Tokens,
  Visitor
});
