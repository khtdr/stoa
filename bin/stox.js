"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// ../node_modules/.pnpm/opts@2.0.2/node_modules/opts/src/opts.js
var require_opts = __commonJS({
  "../node_modules/.pnpm/opts@2.0.2/node_modules/opts/src/opts.js"(exports) {
    var puts = console.log;
    var values = {};
    var args = {};
    var argv = [];
    var errors = [];
    var descriptors = { opts: [], args: [] };
    exports.version = "2.0.2";
    exports.add = function(options, namespace) {
      for (var i = 0; i < options.length; i++) {
        options[i].namespace = namespace;
        descriptors.opts.push(options[i]);
      }
    };
    exports.parse = function(options, params, help) {
      if (params === true) {
        help = true;
        params = [];
      } else if (!params) {
        params = [];
      } else {
        for (var i = 0; i < params.length; i++) {
          descriptors.args.push(params[i]);
        }
      }
      if (help) {
        options.push({
          long: "help",
          description: "Show this help message",
          callback: exports.help
        });
      }
      for (var i = 0; i < options.length; i++) {
        descriptors.opts.unshift(options[i]);
      }
      options = descriptors.opts;
      var checkDup = /* @__PURE__ */ __name(function(opt2, type) {
        var prefix = type == "short" ? "-" : "--";
        var name = opt2[type];
        if (!opts2[prefix + name]) {
          opts2[prefix + name] = opt2;
        } else {
          if (opt2.namespace && !opts2[prefix + opt2.namespace + "." + name]) {
            opts2[prefix + opt2.namespace + "." + name] = opt2;
            for (var i2 = 0; i2 < descriptors.opts.length; i2++) {
              var desc = descriptors.opts[i2];
              if (desc.namespace == opt2.namespace) {
                if (type == "long" && desc.long == opt2.long) {
                  descriptors.opts[i2].long = opt2.namespace + "." + opt2.long;
                } else if (type == "short") {
                  delete descriptors.opts[i2].short;
                }
              }
            }
          } else {
            puts("Conflicting flags: " + prefix + name + "\n");
            puts(helpString());
            process.exit(1);
          }
        }
      }, "checkDup");
      var opts2 = {};
      for (var i = 0; i < options.length; i++) {
        if (options[i].short)
          checkDup(options[i], "short");
        if (options[i].long)
          checkDup(options[i], "long");
      }
      for (var i = 2; i < process.argv.length; i++) {
        var inp = process.argv[i];
        if (opts2[inp]) {
          var opt = opts2[inp];
          if (!opt.value) {
            if (opt.callback)
              opt.callback(true);
            if (opt.short)
              values[opt.short] = true;
            if (opt.long)
              values[opt.long] = true;
          } else {
            var next = process.argv[i + 1];
            if (!next || opts2[next]) {
              var flag = opt.short || opt.long;
              errors.push("Missing value for option: " + flag);
              if (opt.short)
                values[opt.short] = true;
              if (opt.long)
                values[opt.long] = true;
            } else {
              if (opt.callback)
                opt.callback(next);
              if (opt.short)
                values[opt.short] = next;
              if (opt.long)
                values[opt.long] = next;
              i++;
            }
          }
        } else {
          if (inp[0] == "-") {
            puts("Unknown option: " + inp);
            if (opts2["--help"])
              puts("Try --help");
            process.exit(1);
          } else {
            argv.push(inp);
            var arg = params.shift();
            if (arg) {
              args[arg.name] = inp;
              if (arg.callback)
                arg.callback(inp);
            }
          }
        }
      }
      for (var i = 0; i < options.length; i++) {
        var flag = options[i].short || options[i].long;
        if (options[i].required && !exports.get(flag)) {
          errors.push("Missing required option: " + flag);
        }
      }
      for (var i = 0; i < params.length; i++) {
        if (params[i].required && !args[params[i].name]) {
          errors.push("Missing required argument: " + params[i].name);
        }
      }
      if (errors.length) {
        for (var i = 0; i < errors.length; i++)
          puts(errors[i]);
        puts("\n" + helpString());
        process.exit(1);
      }
    };
    exports.get = function(opt) {
      return values[opt] || values["-" + opt] || values["--" + opt];
    };
    exports.values = function() {
      return Object.keys(values).reduce(function(dict, name) {
        name = name.replace("/^-+/", "");
        dict[name] = exports.get(name);
        return dict;
      }, {});
    };
    exports.args = function() {
      return argv;
    };
    exports.arg = function(name) {
      return args[name];
    };
    exports.help = function() {
      puts(helpString());
      process.exit(0);
    };
    var helpString = /* @__PURE__ */ __name(function() {
      var exe = process.argv[0].split(require("path").sep).pop();
      var file = process.argv[1].replace(process.cwd(), ".");
      var str = "Usage: " + exe + " " + file;
      if (descriptors.opts.length)
        str += " [options]";
      if (descriptors.args.length) {
        for (var i = 0; i < descriptors.args.length; i++) {
          if (descriptors.args[i].required) {
            str += " " + descriptors.args[i].name;
          } else {
            str += " [" + descriptors.args[i].name + "]";
          }
        }
      }
      str += "\n";
      for (var i = 0; i < descriptors.opts.length; i++) {
        var opt = descriptors.opts[i];
        if (opt.description)
          str += opt.description + "\n";
        var line = "";
        if (opt.short && !opt.long)
          line += "-" + opt.short;
        else if (opt.long && !opt.short)
          line += "--" + opt.long;
        else
          line += "-" + opt.short + ", --" + opt.long;
        if (opt.value)
          line += " <value>";
        if (opt.required)
          line += " (required)";
        str += "    " + line + "\n";
      }
      return str;
    }, "helpString");
  }
});

// src/cli-app.ts
var import_fs = __toESM(require("fs"));
var import_opts = __toESM(require_opts());

// ../lib/stoa-ltk/language.ts
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
  options(opts2) {
    this.opts = opts2;
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
__name(Language, "Language");

// ../lib/stoa-ltk/tokenizer.ts
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
__name(Token, "Token");
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
    if (this.eof)
      return;
    while (true) {
      const token = this.generator.next().value;
      if (!token) {
        this.eof = true;
        break;
      }
      if (token.name == ERROR_TOKEN) {
        this.reporter.error(token, `Unrecognized input`);
        continue;
      }
      if (token.name.toString().startsWith("_"))
        continue;
      return token;
    }
  }
};
__name(TokenStream, "TokenStream");
function* tokenGenerator(source, lexicon, reporter, start_line = 1, start_column = 1) {
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
  __name(pos, "pos");
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
  __name(longest, "longest");
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
  __name(possible, "possible");
}
__name(tokenGenerator, "tokenGenerator");
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
__name(cStyleCommentScanner, "cStyleCommentScanner");
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
__name(stringScanner, "stringScanner");

// ../lib/stoa-ltk/parser.ts
var Parser = class {
  constructor(tokens, reporter = new StdErrReporter()) {
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
    let token = this.peek() || this.previous();
    if (!this.peek()) {
      const lines = token.text.split("\n");
      const addLines = lines.length - 1;
      const line = token.pos.line + addLines;
      const column = addLines ? lines[lines.length - 1].length + 1 : token.pos.column + token.text.length;
      token = new Token("<EOF>", "", { line, column });
    }
    throw this.error(token, message);
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
  error(token, message = "Unexpected token") {
    this.reporter.error(token, message);
    return new ParseError(message);
  }
};
__name(Parser, "Parser");
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
    throw new ParseError(`Unvisitable node: ${name} (UNIMPLEMENTED BY AUTHOR)`);
  }
};
__name(Visitor, "Visitor");
var ParseError = class extends Error {
};
__name(ParseError, "ParseError");

// ../lib/stoa-ltk/reporter.ts
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
__name(StdErrReporter, "StdErrReporter");

// ../lib/stoa-ltk/runtime.ts
var RuntimeError = class extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
  }
};
__name(RuntimeError, "RuntimeError");

// ../package.json
var version = "2022.07.31";

// src/tokenizer.ts
var _Tokenizer = class extends TokenStream {
  constructor(source, reporter) {
    super(source, _Tokenizer.lexicon, reporter);
  }
};
var Tokenizer = _Tokenizer;
__name(Tokenizer, "Tokenizer");
Tokenizer.lexicon = {
  FALSE: /false/i,
  NIL: /nil/,
  NUMBER: /\d+(\.\d+)?/,
  STRING: Tokens.STRINGS.STD,
  TRUE: /true/i,
  IDENTIFIER: /[a-z][a-z\d]*/i,
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
  COLON: ":",
  COMMA: ",",
  DOT: ".",
  LEFT_CURL: "{",
  LEFT_PAREN: "(",
  QUESTION: "?",
  RIGHT_CURL: "}",
  RIGHT_PAREN: ")",
  SEMICOLON: ";",
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
  _SHEBANG_COMMENT: Tokens.COMMENTS.SHEBANG,
  _MULTI_LINE_COMMENT: Tokens.COMMENTS.C_STYLE,
  _SINGLE_LINE_COMMENT: Tokens.COMMENTS.DOUBLE_SLASH,
  _SPACE: Tokens.SPACE.ALL
};
var TOKEN = Object.keys(Tokenizer.lexicon).reduce((a, c) => (a[c] = c, a), {});

// src/ast/visitor.ts
var Visitor2 = class extends Visitor {
};
__name(Visitor2, "Visitor");

// src/ast/expressions.ts
var AssignExpr = class {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
};
__name(AssignExpr, "AssignExpr");
var BinaryExpr = class {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
};
__name(BinaryExpr, "BinaryExpr");
var CallExpr = class {
  constructor(callee, args, end) {
    this.callee = callee;
    this.args = args;
    this.end = end;
  }
};
__name(CallExpr, "CallExpr");
var FunctionExpr = class {
  constructor(params, block) {
    this.params = params;
    this.block = block;
  }
};
__name(FunctionExpr, "FunctionExpr");
var GroupExpr = class {
  constructor(inner) {
    this.inner = inner;
  }
};
__name(GroupExpr, "GroupExpr");
var LiteralExpr = class {
  constructor(value) {
    this.value = value;
  }
  toString() {
    if (this.value === true || this.value === false)
      return `${this.value}`;
    if (this.value === void 0)
      return "nil";
    if (typeof this.value == "string")
      return this.value;
    const [val, prec] = this.value;
    return `${val.toFixed(prec)}`;
  }
};
__name(LiteralExpr, "LiteralExpr");
var LogicalExpr = class {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
};
__name(LogicalExpr, "LogicalExpr");
var TernaryExpr = class {
  constructor(left, op1, middle, op2, right) {
    this.left = left;
    this.op1 = op1;
    this.middle = middle;
    this.op2 = op2;
    this.right = right;
  }
};
__name(TernaryExpr, "TernaryExpr");
var UnaryExpr = class {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }
};
__name(UnaryExpr, "UnaryExpr");
var VariableExpr = class {
  constructor(name) {
    this.name = name;
  }
};
__name(VariableExpr, "VariableExpr");

// src/printer.ts
var Printer = class extends Visitor2 {
  AssignExpr(assign) {
    return `(= ${assign.name.text} ${this.visit(assign.value)})`;
  }
  BinaryExpr(expr) {
    const operator = expr.operator.text;
    const left = this.visit(expr.left);
    const right = this.visit(expr.right);
    return `(${operator} ${left} ${right})`;
  }
  BlockStmt(block) {
    const blocks = block.statements.map((stmt) => this.visit(stmt)).join("\n");
    return `(block 
${indent(blocks)}
)`;
  }
  CallExpr(call) {
    const callee = `(call ${this.visit(call.callee)}`;
    if (!call.args.length)
      return `${callee})`;
    const args = call.args.map((arg) => this.visit(arg)).join(" ");
    return `${callee} ${args})`;
  }
  ExpressionStmt(statement) {
    return this.visit(statement.expr);
  }
  FunctionExpr(fun) {
    const params = fun.params.map((p) => p.text).join(" ");
    const body = this.visit(fun.block);
    return `(let [${params}] ${body})`;
  }
  FunctionDecl(decl) {
    const name = decl.name.text;
    const val = this.visit(decl.func);
    return `(fun ${name} ${val})`;
  }
  GroupExpr(expr) {
    const operand = this.visit(expr.inner);
    return `(group ${operand})`;
  }
  IfStmt(statement) {
    const cond = this.visit(statement.condition);
    const stmtTrue = this.visit(statement.trueStatement);
    if (!statement.falseStatement)
      return `(if ${cond} ${stmtTrue})`;
    const stmtFalse = this.visit(statement.falseStatement);
    return `(if ${cond} 
${indent(stmtTrue)} 
${indent(stmtFalse)})`;
  }
  JumpStmt(statement) {
    const dest = statement.keyword.name;
    const dist = this.visit(statement.distance || new LiteralExpr([1, 0]));
    return `(${dest} ${dist})`;
  }
  LiteralExpr(expr) {
    return expr.toString();
  }
  LogicalExpr(expr) {
    return this.BinaryExpr(expr);
  }
  PrintStmt(statement) {
    return `(print ${this.visit(statement.expr)})`;
  }
  Program(program) {
    const decls = program.code.map((decl) => this.visit(decl)).join("\n");
    return `(program 
${indent(decls)}
)`;
  }
  ReturnStmt(ret) {
    return `(return ${this.visit(ret.expr)})`;
  }
  TernaryExpr(expr) {
    const left = this.visit(expr.left);
    const middle = this.visit(expr.middle);
    const right = this.visit(expr.right);
    return `(?: ${left} ${middle} ${right})`;
  }
  UnaryExpr(expr) {
    const operator = expr.operator.text;
    const operand = this.visit(expr.operand);
    return `(${operator} ${operand})`;
  }
  VariableDecl(declaration) {
    const decl = `(var ${declaration.name.text}`;
    const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : "";
    return `${decl}${init})`;
  }
  VariableExpr(expr) {
    return `${expr.name.text}`;
  }
  WhileStmt(statement) {
    const cond = this.visit(statement.condition);
    const body = this.visit(statement.body);
    return `(while ${cond} 
${indent(body)}
)`;
  }
};
__name(Printer, "Printer");
function indent(text) {
  const pad = new Array(3).fill(" ").join("");
  return text.replace(/^/mg, pad);
}
__name(indent, "indent");

// src/ast/declarations.ts
var FunctionDecl = class {
  constructor(name, func) {
    this.name = name;
    this.func = func;
  }
};
__name(FunctionDecl, "FunctionDecl");
var VariableDecl = class {
  constructor(name, expr) {
    this.name = name;
    this.expr = expr;
  }
};
__name(VariableDecl, "VariableDecl");

// src/ast/nodes.ts
var Program = class {
  constructor(code) {
    this.code = code;
  }
};
__name(Program, "Program");

// src/ast/statements.ts
var BlockStmt = class {
  constructor(statements) {
    this.statements = statements;
  }
};
__name(BlockStmt, "BlockStmt");
var ExpressionStmt = class {
  constructor(expr) {
    this.expr = expr;
  }
};
__name(ExpressionStmt, "ExpressionStmt");
var IfStmt = class {
  constructor(condition, trueStatement, falseStatement) {
    this.condition = condition;
    this.trueStatement = trueStatement;
    this.falseStatement = falseStatement;
  }
};
__name(IfStmt, "IfStmt");
var JumpStmt = class {
  constructor(keyword, distance) {
    this.keyword = keyword;
    this.distance = distance;
  }
};
__name(JumpStmt, "JumpStmt");
var PrintStmt = class {
  constructor(expr) {
    this.expr = expr;
  }
};
__name(PrintStmt, "PrintStmt");
var ReturnStmt = class {
  constructor(expr, keyword) {
    this.expr = expr;
    this.keyword = keyword;
  }
};
__name(ReturnStmt, "ReturnStmt");
var WhileStmt = class {
  constructor(condition, body) {
    this.condition = condition;
    this.body = body;
  }
};
__name(WhileStmt, "WhileStmt");

// src/parser.ts
var Parser2 = class extends Parser {
  parse() {
    if (!this._parsed)
      this._parsed = this.Program();
    return this._parsed;
  }
  toString() {
    if (!this._parsed)
      return "un-parsed";
    return new Printer().visit(this._parsed);
  }
  print(ast = this._parsed, level = "log") {
    const message = !ast ? "()" : new Printer().visit(ast);
    console[level](message);
  }
  Program() {
    const declarations = [];
    while (!this.atEnd()) {
      const decl = this.Declaration();
      if (decl)
        declarations.push(decl);
    }
    return new Program(declarations);
  }
  Declaration() {
    try {
      return this.FunDeclaration() || this.VarDeclaration() || this.Statement();
    } catch (err) {
      if (err instanceof ParseError) {
        this.synchronize();
        return;
      } else
        throw err;
    }
  }
  FunDeclaration() {
    var _a, _b;
    if (((_a = this.peek(1)) == null ? void 0 : _a.name) == TOKEN.FUN && ((_b = this.peek(2)) == null ? void 0 : _b.name) == TOKEN.IDENTIFIER) {
      this.match(TOKEN.FUN);
      const ident = this.consume("IDENTIFIER", "Expected identifier");
      const fun = this.Function();
      return new FunctionDecl(ident, fun);
    }
  }
  Function() {
    this.consume(TOKEN.LEFT_PAREN, "Expected (");
    const parameters = this.Parameters();
    this.consume(TOKEN.RIGHT_PAREN, "Expected )");
    const block = this.Block();
    if (!block)
      throw this.error(this.peek(), "Expected {");
    return new FunctionExpr(parameters, block);
  }
  Parameters() {
    var _a, _b;
    const params = [];
    if (((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.RIGHT_PAREN) {
      if (params.length >= 255)
        this.error(this.peek(), "Too many params (255 max)");
      do {
        const id = this.consume(TOKEN.IDENTIFIER, "expected param name");
        params.push(id);
      } while (((_b = this.peek()) == null ? void 0 : _b.name) == TOKEN.COMMA);
    }
    return params;
  }
  VarDeclaration() {
    if (this.match(TOKEN.VAR)) {
      const ident = this.consume("IDENTIFIER", "Expected identifier");
      let expr;
      if (this.match(TOKEN.EQUAL)) {
        expr = this.Expression();
      }
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      return new VariableDecl(ident, expr);
    }
  }
  Statement() {
    return this.PrintStatement() || this.ReturnStatement() || this.IfStatement() || this.WhileStatement() || this.ForStatement() || this.JumpStatement() || this.Block() || this.ExpressionStatement();
  }
  ReturnStatement() {
    if (this.match(TOKEN.RETURN)) {
      const keyword = this.previous();
      let expr = new LiteralExpr(void 0);
      if (!this.match(TOKEN.SEMICOLON)) {
        expr = this.Expression();
        this.consume(TOKEN.SEMICOLON, "Expected ;");
      }
      return new ReturnStmt(expr, keyword);
    }
  }
  Block() {
    var _a;
    if (this.match(TOKEN.LEFT_CURL)) {
      const declarations = [];
      while (!this.atEnd() && ((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.RIGHT_CURL) {
        const decl = this.Declaration();
        if (decl)
          declarations.push(decl);
      }
      const block = new BlockStmt(declarations);
      this.consume(TOKEN.RIGHT_CURL, "Expected }");
      return block;
    }
  }
  JumpStatement() {
    var _a;
    if (this.match(TOKEN.BREAK, TOKEN.CONTINUE)) {
      const jump = this.previous();
      let expr = new LiteralExpr([1, 0]);
      if (((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.SEMICOLON)
        expr = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      return new JumpStmt(jump, expr);
    }
  }
  IfStatement() {
    if (this.match(TOKEN.IF)) {
      this.consume(TOKEN.LEFT_PAREN, "Expected (");
      const cond = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, "Expected )");
      const trueStatement = this.Statement();
      if (this.match(TOKEN.ELSE)) {
        const falseStatement = this.Statement();
        return new IfStmt(cond, trueStatement, falseStatement);
      } else {
        return new IfStmt(cond, trueStatement);
      }
    }
  }
  WhileStatement() {
    if (this.match(TOKEN.WHILE)) {
      this.consume(TOKEN.LEFT_PAREN, "Expected (");
      const cond = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, "Expected )");
      const body = this.Statement();
      return new WhileStmt(cond, body);
    }
  }
  ForStatement() {
    var _a, _b;
    if (this.match(TOKEN.FOR)) {
      this.consume(TOKEN.LEFT_PAREN, "Expected (");
      const init = this.VarDeclaration() || this.ExpressionStatement() || this.consume(TOKEN.SEMICOLON, "Expected ;") && new LiteralExpr(true);
      let cond = new LiteralExpr(true);
      if (((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.SEMICOLON)
        cond = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      let incr = new LiteralExpr(true);
      if (((_b = this.peek()) == null ? void 0 : _b.name) != TOKEN.RIGHT_PAREN)
        incr = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, "Expected )");
      const body_statement = this.Statement();
      return new BlockStmt([
        init,
        new WhileStmt(cond, new BlockStmt([
          body_statement,
          new ExpressionStmt(incr)
        ]))
      ]);
    }
  }
  PrintStatement() {
    if (this.match(TOKEN.PRINT)) {
      const expr = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      return new PrintStmt(expr);
    }
  }
  ExpressionStatement() {
    const expr = this.Expression();
    this.consume(TOKEN.SEMICOLON, "Expected ;");
    return new ExpressionStmt(expr);
  }
  Expression() {
    return this.Comma();
  }
  Comma() {
    let expr = this.Assignment();
    while (this.match(TOKEN.COMMA)) {
      const comma = this.previous();
      const right = this.Assignment();
      expr = new BinaryExpr(expr, comma, right);
    }
    return expr;
  }
  Assignment() {
    const expr = this.LogicOr();
    if (this.match(TOKEN.EQUAL)) {
      const eq = this.previous();
      const value = this.Assignment();
      if (expr instanceof VariableExpr) {
        return new AssignExpr(expr.name, value);
      }
      this.error(eq, "Invalid assignment target");
    }
    return expr;
  }
  LogicOr() {
    let expr = this.LogicAnd();
    while (this.match(TOKEN.OR)) {
      const or = this.previous();
      const right = this.LogicAnd();
      expr = new LogicalExpr(expr, or, right);
    }
    return expr;
  }
  LogicAnd() {
    let expr = this.Conditional();
    while (this.match(TOKEN.AND)) {
      const and = this.previous();
      const right = this.Conditional();
      expr = new LogicalExpr(expr, and, right);
    }
    return expr;
  }
  Conditional() {
    let expr = this.Equality();
    while (this.match(TOKEN.QUESTION)) {
      const question = this.previous();
      const middle = this.Equality();
      this.consume(TOKEN.COLON, "Expected :");
      const colon = this.previous();
      const right = this.Equality();
      expr = new TernaryExpr(expr, question, middle, colon, right);
    }
    return expr;
  }
  Equality() {
    let expr = this.Comparison();
    while (this.match(TOKEN.BANG_EQUAL, TOKEN.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.Comparison();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  Comparison() {
    let expr = this.Term();
    while (this.match(TOKEN.LESS, TOKEN.GREATER, TOKEN.LESS_EQUAL, TOKEN.GREATER_EQUAL)) {
      const operator = this.previous();
      const right = this.Term();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  Term() {
    let expr = this.Factor();
    while (this.match(TOKEN.PLUS, TOKEN.DASH)) {
      const operator = this.previous();
      const right = this.Factor();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  Factor() {
    let expr = this.Unary();
    while (this.match(TOKEN.STAR, TOKEN.SLASH)) {
      const operator = this.previous();
      const right = this.Unary();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  Unary() {
    while (this._InvalidUnary()) {
    }
    return this._ValidUnary();
  }
  _InvalidUnary() {
    if (this.match(TOKEN.PLUS, TOKEN.STAR, TOKEN.SLASH)) {
      this.reporter.error(this.previous(), "Binary operator is missing the left operand");
      this.previous();
      return this.Unary();
    }
    return;
  }
  _ValidUnary() {
    if (this.match(TOKEN.BANG, TOKEN.DASH)) {
      const operator = this.previous();
      const right = this.Unary();
      return new UnaryExpr(operator, right);
    }
    return this.Call();
  }
  Call() {
    let expr = this.Primary();
    if (!this.check(TOKEN.LEFT_PAREN))
      return expr;
    while (true) {
      if (!this.match(TOKEN.LEFT_PAREN))
        break;
      const args = [];
      if (!this.check(TOKEN.RIGHT_PAREN)) {
        if (args.length >= 255)
          this.error(this.peek(), "Too many args (255 max)");
        do {
          args.push(this.Expression());
        } while (this.match(TOKEN.COMMA));
      }
      const paren = this.consume(TOKEN.RIGHT_PAREN, "Expected ) after arguments");
      expr = new CallExpr(expr, args, paren);
    }
    return expr;
  }
  Primary() {
    if (this.match(TOKEN.NUMBER)) {
      const numStr = this.previous().text;
      const value = parseFloat(numStr);
      const precision = `${numStr}.`.split(".")[1].length;
      return new LiteralExpr([value, precision]);
    }
    if (this.match(TOKEN.STRING)) {
      const str = this.previous().text;
      let value;
      if (['"', "'"].includes(str.substring(str.length - 1)))
        value = str.replace(/^.(.*).$/, "$1");
      else
        value = str.replace(/^.(.*)$/, "$1");
      return new LiteralExpr(value);
    }
    if (this.match(TOKEN.TRUE)) {
      return new LiteralExpr(true);
    }
    if (this.match(TOKEN.FALSE)) {
      return new LiteralExpr(false);
    }
    if (this.match(TOKEN.NIL)) {
      return new LiteralExpr(void 0);
    }
    if (this.match(TOKEN.IDENTIFIER)) {
      return new VariableExpr(this.previous());
    }
    if (this.match(TOKEN.LEFT_PAREN)) {
      const expr = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, 'Expected ")" after expression');
      return new GroupExpr(expr);
    }
    if (this.match(TOKEN.FUN)) {
      return this.Function();
    }
    throw `Expected expression at ${this.peek()}`;
  }
  synchronize() {
    var _a;
    this.advance();
    while (!this.atEnd()) {
      if (this.previous().name == "SEMICOLON")
        return;
      switch (((_a = this.peek()) == null ? void 0 : _a.name) ?? "") {
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
};
__name(Parser2, "Parser");

// src/resolver.ts
var Resolver = class extends Visitor2 {
  constructor(reporter, evaluator) {
    super();
    this.reporter = reporter;
    this.evaluator = evaluator;
    this.currentFunction = 0 /* NONE */;
    this.scopes = [];
  }
  beginScope() {
    this.scopes.unshift({});
  }
  endScope() {
    this.scopes.shift();
  }
  declare(ident) {
    const scope = this.scopes[0];
    if (!scope)
      return;
    if (scope[ident.text] === 0 /* DECLARED */)
      this.reporter.error(ident, "Variable is already declared");
    if (scope[ident.text] === 1 /* DEFINED */)
      this.reporter.error(ident, "Variable is already defined");
    scope[ident.text] = 0 /* DECLARED */;
  }
  define(ident) {
    const scope = this.scopes[0];
    if (!scope)
      return;
    scope[ident.text] = 1 /* DEFINED */;
  }
  resolveLocal(expr, token) {
    this.scopes.find((scope, i) => {
      if (scope[token.text]) {
        this.evaluator.resolve(expr, i);
        return true;
      }
      return false;
    });
  }
  resolveFunction(fun, ft) {
    const encFunction = this.currentFunction;
    this.currentFunction = ft;
    this.beginScope();
    for (const param of fun.params) {
      this.declare(param);
      this.define(param);
    }
    this.visit(fun.block);
    this.endScope();
    this.currentFunction = encFunction;
  }
  AssignExpr(expr) {
    this.visit(expr.value);
    this.resolveLocal(expr, expr.name);
  }
  BinaryExpr(expr) {
    this.visit(expr.left);
    this.visit(expr.right);
  }
  BlockStmt(block) {
    this.beginScope();
    for (const stmt of block.statements)
      this.visit(stmt);
    this.endScope();
  }
  CallExpr(expr) {
    this.visit(expr.callee);
    for (const arg of expr.args)
      this.visit(arg);
  }
  ExpressionStmt(stmt) {
    this.visit(stmt.expr);
  }
  FunctionExpr(expr) {
    this.resolveFunction(expr, 1 /* FUNCTION */);
  }
  FunctionDecl(decl) {
    this.declare(decl.name);
    this.define(decl.name);
    this.resolveFunction(decl.func, 1 /* FUNCTION */);
  }
  GroupExpr(expr) {
    this.visit(expr.inner);
  }
  IfStmt(stmt) {
    this.visit(stmt.condition);
    this.visit(stmt.trueStatement);
    if (stmt.falseStatement)
      this.visit(stmt.falseStatement);
  }
  JumpStmt(stmt) {
    this.visit(stmt.distance);
  }
  LiteralExpr(_expr) {
  }
  LogicalExpr(expr) {
    this.visit(expr.left);
    this.visit(expr.right);
  }
  PrintStmt(stmt) {
    this.visit(stmt.expr);
  }
  Program(program) {
    for (const decl of program.code)
      this.visit(decl);
  }
  ReturnStmt(stmt) {
    if (this.currentFunction == 0 /* NONE */)
      this.reporter.error(stmt.keyword, "No return from top-level allowed");
    this.visit(stmt.expr);
  }
  TernaryExpr(expr) {
    this.visit(expr.left);
    this.visit(expr.middle);
    this.visit(expr.right);
  }
  UnaryExpr(expr) {
    this.visit(expr.operand);
  }
  VariableDecl(decl) {
    this.declare(decl.name);
    if (decl.expr) {
      this.visit(decl.expr);
    }
    this.define(decl.name);
  }
  VariableExpr(expr) {
    const scope = this.scopes[0];
    if (!scope)
      return;
    if (scope[expr.name.text] === 0 /* DECLARED */)
      this.reporter.error(expr.name, "Reference to uninitialized variable");
    this.resolveLocal(expr, expr.name);
  }
  WhileStmt(stmt) {
    this.visit(stmt.condition);
    this.visit(stmt.body);
  }
};
__name(Resolver, "Resolver");

// src/runtime/environment.ts
var Environment = class {
  constructor(enclosure) {
    this.enclosure = enclosure;
    this.table = /* @__PURE__ */ new Map();
  }
  has(name) {
    var _a;
    return this.table.has(name.text) || !!((_a = this.enclosure) == null ? void 0 : _a.has(name));
  }
  init(name) {
    if (!this.table.has(name.text))
      this.table.set(name.text, void 0);
  }
  set(name, value, distance = 0) {
    var _a;
    if (distance > 0 && this.enclosure)
      return this.enclosure.set(name, value, distance - 1);
    if (this.table.has(name.text))
      this.table.set(name.text, value);
    else if ((_a = this.enclosure) == null ? void 0 : _a.has(name))
      this.enclosure.set(name, value);
    else
      throw new RuntimeError(name, `No such variable: ${name.text}`);
  }
  get(name, distance = 0) {
    var _a;
    if (distance > 0 && this.enclosure)
      return this.enclosure.get(name, distance - 1);
    if (this.table.has(name.text))
      return this.table.get(name.text);
    if ((_a = this.enclosure) == null ? void 0 : _a.has(name))
      return this.enclosure.get(name);
    throw new RuntimeError(name, `Undefined variable: ${name.text}`);
  }
};
__name(Environment, "Environment");

// src/runtime/globals.ts
function registerGlobals(evaluator) {
  evaluator.globals.init({ text: "clock" });
  evaluator.globals.set({ text: "clock" }, {
    arity: 0,
    call() {
      return new Date().toLocaleString();
    }
  });
}
__name(registerGlobals, "registerGlobals");

// src/runtime/values.ts
function isNumber(val) {
  return Array.isArray(val) && val.length == 2;
}
__name(isNumber, "isNumber");
function isString(val) {
  return typeof val == "string";
}
__name(isString, "isString");
function truthy(val) {
  if (val === false)
    return false;
  if (val === void 0)
    return false;
  return true;
}
__name(truthy, "truthy");

// src/runtime/control-flow.ts
var ReturnException = class {
  constructor(value = void 0) {
    this.value = value;
  }
};
__name(ReturnException, "ReturnException");
var JumpException = class {
  constructor(distance = 1) {
    this.distance = distance;
  }
};
__name(JumpException, "JumpException");
var BreakException = class extends JumpException {
};
__name(BreakException, "BreakException");
var ContinueException = class extends JumpException {
};
__name(ContinueException, "ContinueException");
function isCallable(val) {
  if (!val)
    return false;
  return !!val.call;
}
__name(isCallable, "isCallable");
var Function = class {
  constructor(arity, call) {
    this.arity = arity;
    this.call = call;
  }
};
__name(Function, "Function");

// src/interpreter.ts
var Interpreter = class extends Visitor2 {
  constructor(reporter) {
    super();
    this.reporter = reporter;
    this.globals = new Environment();
    this.env = this.globals;
    this.locals = /* @__PURE__ */ new Map();
    registerGlobals(this);
  }
  resolve(expr, depth) {
    this.locals.set(expr, depth);
  }
  lookUpVariable(name, expr) {
    const distance = this.locals.get(expr);
    if (distance !== void 0)
      return this.env.get(name, distance);
    return this.globals.get(name);
  }
  AssignExpr(expr) {
    const value = this.visit(expr.value);
    const distance = this.locals.get(expr);
    if (distance !== void 0)
      this.env.set(expr.name, value, distance);
    else
      this.globals.set(expr.name, value);
    return value;
  }
  BinaryExpr(expr) {
    const {
      operator: { name: op }
    } = expr;
    const left = this.visit(expr.left);
    const right = this.visit(expr.right);
    if (op == TOKEN.COMMA)
      return right;
    if (op == TOKEN.PLUS) {
      if (isString(left) || isString(right)) {
        const lStr = isCallable(left) ? left : new LiteralExpr(left);
        const rStr = isCallable(right) ? right : new LiteralExpr(right);
        return `${lStr}${rStr}`;
      }
    }
    if (op == TOKEN.EQUAL_EQUAL) {
      if (isNumber(left) && isNumber(right))
        return left[0] == right[0];
      else
        return left === right;
    }
    if (op == TOKEN.BANG_EQUAL) {
      if (isNumber(left) && isNumber(right))
        return left[0] != right[0];
      else
        return left !== right;
    }
    if (!isNumber(left) || !isNumber(right))
      throw new RuntimeError(expr.operator, "number values expected");
    if (right[0] == 0)
      throw new RuntimeError(expr.operator, "divide by zero");
    if (op == TOKEN.PLUS)
      return [left[0] + right[0], Math.max(left[1], right[1])];
    if (op == TOKEN.DASH)
      return [left[0] - right[0], Math.max(left[1], right[1])];
    if (op == TOKEN.STAR)
      return [left[0] * right[0], Math.max(left[1], right[1])];
    if (op == TOKEN.SLASH)
      return [left[0] / right[0], Math.max(left[1], right[1])];
    if (op == TOKEN.GREATER)
      return left[0] > right[0];
    if (op == TOKEN.GREATER_EQUAL)
      return left[0] >= right[0];
    if (op == TOKEN.LESS)
      return left[0] < right[0];
    if (op == TOKEN.LESS_EQUAL)
      return left[0] <= right[0];
    throw new RuntimeError(expr.operator, "Unexpected binary expression");
  }
  BlockStmt(block) {
    const previous = this.env;
    this.env = new Environment(previous);
    try {
      block.statements.map((stmt) => this.visit(stmt));
    } finally {
      this.env = previous;
    }
  }
  CallExpr(call) {
    const callee = this.visit(call.callee);
    if (!isCallable(callee))
      throw new RuntimeError(call.end, "uncallable target");
    if (callee.arity != call.args.length)
      throw new RuntimeError(call.end, "wrong number of args");
    return callee.call(call.args.map((arg) => this.visit(arg)));
  }
  ExpressionStmt(statement) {
    this.visit(statement.expr);
  }
  FunctionExpr(fun) {
    const closure = new Environment(this.env);
    return new Function(fun.params.length, (args) => {
      const previous = this.env;
      this.env = new Environment(closure);
      try {
        args.map((arg, i) => {
          const param = fun.params[i];
          this.env.init(param);
          this.env.set(param, arg);
        });
        this.visit(fun.block);
      } catch (e) {
        if (e instanceof ReturnException) {
          return e.value;
        } else
          throw e;
      } finally {
        this.env = previous;
      }
    });
  }
  FunctionDecl(decl) {
    const func = this.FunctionExpr(decl.func);
    this.env.init(decl.name);
    this.env.set(decl.name, func);
  }
  GroupExpr(expr) {
    return this.visit(expr.inner);
  }
  IfStmt(statement) {
    const condition = this.visit(statement.condition);
    if (truthy(condition))
      this.visit(statement.trueStatement);
    else if (statement.falseStatement)
      this.visit(statement.falseStatement);
  }
  JumpStmt(stmt) {
    const distance = this.visit(stmt.distance || new LiteralExpr([1, 0]));
    if (!isNumber(distance))
      throw new RuntimeError(stmt.keyword, "expected numerical distance");
    throw stmt.keyword.name == TOKEN.BREAK ? new BreakException(distance[0]) : new ContinueException(distance[0]);
  }
  LiteralExpr(expr) {
    return expr.value;
  }
  LogicalExpr(expr) {
    const {
      operator: { name: op }
    } = expr;
    const left = this.visit(expr.left);
    const left_truthy = truthy(left);
    if (op == TOKEN.OR && left_truthy)
      return left;
    if (op == TOKEN.AND && !left_truthy)
      return left;
    const right = this.visit(expr.right);
    if (truthy(right))
      return right;
    return truthy(false);
  }
  PrintStmt(statement) {
    const val = this.visit(statement.expr);
    const str = isCallable(val) ? val : new LiteralExpr(val).toString();
    console.log(str + "");
  }
  Program(program) {
    try {
      const statements = program.code.map((stmt) => this.visit(stmt));
      const last = statements[statements.length - 1];
      if (isCallable(last))
        return `${last}`;
      return new LiteralExpr(last).toString();
    } catch (e) {
      if (!(e instanceof RuntimeError)) {
        this.reporter.error(void 0, e.message);
      } else {
        this.reporter.error(e.token, e.message);
      }
    }
  }
  ReturnStmt(ret) {
    const value = this.visit(ret.expr);
    throw new ReturnException(value);
  }
  TernaryExpr(expr) {
    const {
      op1: { name: op1 },
      op2: { name: op2 }
    } = expr;
    if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
      const left = this.visit(expr.left);
      if (truthy(left))
        return this.visit(expr.middle);
      return this.visit(expr.right);
    }
    throw new RuntimeError(op1, "Unexpected ternary expression");
  }
  UnaryExpr(expr) {
    const {
      operator: { name: op }
    } = expr;
    const value = this.visit(expr.operand);
    if (op == TOKEN.BANG)
      return !truthy(value);
    if (!isNumber(value))
      throw new RuntimeError(op, "must negate a number value");
    if (op == TOKEN.DASH)
      return [-value[0], value[1]];
    throw new RuntimeError(op, "Unexpected unary expression");
  }
  VariableDecl(declaration) {
    this.env.init(declaration.name);
    const val = declaration.expr ? this.visit(declaration.expr) : void 0;
    this.env.set(declaration.name, val);
  }
  VariableExpr(expr) {
    return this.lookUpVariable(expr.name, expr);
  }
  WhileStmt(statement) {
    while (truthy(this.visit(statement.condition))) {
      try {
        this.visit(statement.body);
      } catch (e) {
        if (e instanceof JumpException) {
          if (e.distance > 1) {
            e.distance -= 1;
            throw e;
          }
          if (e instanceof ContinueException)
            continue;
          if (e instanceof BreakException)
            break;
        }
      }
    }
  }
};
__name(Interpreter, "Interpreter");

// src/stox-lang.ts
var StoxLang = class extends Language {
  constructor() {
    super(...arguments);
    this.version = version;
    this.Tokenizer = Tokenizer;
    this.Parser = Parser2;
    this.Resolver = Resolver;
    this.Interpreter = Interpreter;
  }
};
__name(StoxLang, "StoxLang");

// ../lib/repl-kit/index.ts
var Repl = class {
  constructor(lang) {
    this.lang = lang;
  }
  async run() {
    return new Promise((resolve) => resolve(void 0));
  }
};
__name(Repl, "Repl");

// src/repl.ts
var Repl2 = class extends Repl {
};
__name(Repl2, "Repl");

// src/cli-app.ts
import_opts.default.parse([
  { short: "r", long: "repl", description: "runs the repl" },
  { short: "t", long: "tokens", description: "prints tokens and exits " },
  { short: "p", long: "parse", description: "prints parse tree and exits " },
  {
    short: "v",
    long: "version",
    description: "prints version info and exits "
  }
], [{ name: "file" }], true);
var Stox = new StoxLang();
if (import_opts.default.get("version")) {
  console.log(`stox-${Stox.version}`);
  process.exit(0);
}
var tokenize = import_opts.default.get("tokens");
var parse = import_opts.default.get("parse");
var stage = tokenize && "scan" || parse && "parse" || "eval";
Stox.options({ stage });
if (import_opts.default.get("repl")) {
  const repl = new Repl2(Stox);
  repl.run().finally(() => process.exit(0));
} else {
  const fileName = import_opts.default.arg("file") ?? "/dev/stdin";
  const sourceCode = import_fs.default.readFileSync(fileName).toString();
  Stox.run(fileName, sourceCode);
  process.exit(Stox.errored ? 1 : 0);
}
//# sourceMappingURL=stox.js.map