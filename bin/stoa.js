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

// node_modules/.pnpm/opts@2.0.2/node_modules/opts/src/opts.js
var require_opts = __commonJS({
  "node_modules/.pnpm/opts@2.0.2/node_modules/opts/src/opts.js"(exports) {
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
            var arg2 = params.shift();
            if (arg2) {
              args[arg2.name] = inp;
              if (arg2.callback)
                arg2.callback(inp);
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

// src/lib/cli.ts
var import_fs = require("fs");
var opts = __toESM(require_opts());
var import_path = require("path");
var Launcher = class {
  constructor(config) {
    this.config = config;
    this.output = "evaluate";
    this.runFile = false;
    this.runRepl = false;
    this.runPipe = false;
    this.configured = false;
  }
  drive(runner) {
    this.configure();
    runner.target = this.output;
    let result;
    if (this.runFile)
      result = runner.run((0, import_fs.readFileSync)((0, import_path.resolve)(this.runFile)).toString());
    if (this.runPipe)
      result = runner.run((0, import_fs.readFileSync)("/dev/stdin").toString());
    const FormatFns = this.config.Formatters || Formatters;
    const format = FormatFns[this.output] || Formatters[this.output];
    console.log(format(result));
    process.exit(runner.status);
  }
  configure() {
    if (this.configured)
      return;
    this.configured = true;
    opts.parse([
      {
        long: "version",
        short: "v",
        description: "Displays the version and exits"
      },
      {
        long: "tokenize",
        short: "t",
        description: "Emits the list of tokens (JSON)"
      },
      {
        long: "parse",
        short: "p",
        description: "Emits the parse tree (CST/JSON)"
      },
      {
        long: "repl",
        short: "r",
        description: "Launch a colorful REPL"
      }
    ], [{ name: "file" }], true);
    const file = opts.arg("file");
    if (file)
      this.runFile = file;
    if (opts.get("repl"))
      this.runRepl = true;
    else if (!file)
      this.runPipe = true;
    this.output = "evaluate";
    if (opts.get("tokenize"))
      this.output = "tokenize";
    if (opts.get("parse"))
      this.output = "parse";
    if (opts.get("version")) {
      console.log(`${this.config.name}-${this.config.version}`);
      process.exit(0);
    }
  }
};
__name(Launcher, "Launcher");
var Formatters = {
  tokenize(stream) {
    return stream.drain().map((t) => t.toString()).join("\n");
  },
  parse(ast) {
    return JSON.stringify(ast);
  },
  evaluate(value) {
    return value;
  }
};

// src/lib/language.ts
var Language = class {
  constructor(TokenizerClass, ParserClass, EvaluatorClass) {
    this.engine = new Engine(TokenizerClass, ParserClass, EvaluatorClass);
    this.driver = new Driver(this.engine);
  }
};
__name(Language, "Language");
var Driver = class {
  constructor(engine) {
    this.engine = engine;
    this.status = 0;
    this.target = "evaluate";
  }
  run(program) {
    return this.engine[this.target](program);
  }
};
__name(Driver, "Driver");
var Engine = class {
  constructor(TokenizerClass, ParserClass, EvaluatorClass) {
    this.TokenizerClass = TokenizerClass;
    this.ParserClass = ParserClass;
    this.EvaluatorClass = EvaluatorClass;
  }
  tokenize(source) {
    return new this.TokenizerClass(source);
  }
  parse(source) {
    const stream = this.tokenize(source);
    return new this.ParserClass(stream).parse();
  }
  evaluate(source) {
    const ast = this.parse(source);
    const evaluator = new this.EvaluatorClass();
    return ast.accept(evaluator);
  }
};
__name(Engine, "Engine");

// src/lib/tokenizer.ts
var ERROR_TOKEN = "::error";
var Token = class {
  constructor(name, text, value, pos) {
    this.name = name;
    this.text = text;
    this.value = value;
    this.pos = pos;
  }
  toString() {
    const value = this.text === this.value ? "" : `(${this.value})`;
    return `${this.name}${value}`;
  }
};
__name(Token, "Token");
var TokenStream = class {
  constructor(source, lexicon = {}) {
    this.buffer = [];
    this.generator = tokenGenerator(source, lexicon);
  }
  take() {
    if (this.buffer.length)
      return this.buffer.shift();
    return this.next();
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
  next() {
    while (true) {
      const token = this.generator.next().value;
      if (!token)
        break;
      if (token.name.toString().startsWith("_"))
        continue;
      if (token.name == ERROR_TOKEN) {
        this.error(token);
        continue;
      }
      return token;
    }
  }
  error(token) {
    this.errors = this.errors || [];
    this.errors.push({ char: token.text, ...token.pos });
  }
};
__name(TokenStream, "TokenStream");
var TokenStreamClassFactory = class {
  static build(lexicon) {
    class TokenStreamClassFactoryClass extends TokenStream {
      constructor(source) {
        super(source, lexicon);
      }
    }
    __name(TokenStreamClassFactoryClass, "TokenStreamClassFactoryClass");
    return [
      TokenStreamClassFactoryClass,
      Object.keys(lexicon).reduce((a, c) => (a[c] = c, a), {})
    ];
  }
};
__name(TokenStreamClassFactory, "TokenStreamClassFactory");
function* tokenGenerator(source, lexicon) {
  let idx = 0, line = 1, column = 1;
  while (idx < source.length) {
    const [
      name = ERROR_TOKEN,
      text = source[idx],
      value
    ] = longest(possible());
    const token = new Token(name, text, value, pos());
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
    return candidates.reduce((longest2, current) => current[1].length > longest2[1].length ? current : longest2);
  }
  __name(longest, "longest");
  function possible() {
    const candidates = [];
    Object.entries(lexicon).map(([name, rule]) => {
      const [lexeme, valueFn = /* @__PURE__ */ __name((val) => val, "valueFn")] = Array.isArray(rule) ? rule : [rule];
      if (typeof lexeme == "function") {
        const text = lexeme(source.substring(idx));
        if (text)
          candidates.push([name, text, valueFn(text)]);
      } else if (typeof lexeme != "string") {
        const regex = new RegExp(`^${lexeme.source}`, lexeme.flags);
        const match = regex.exec(source.substring(idx));
        if (match)
          return candidates.push([name, match[0], valueFn(match[0])]);
      } else if (source.substring(idx, idx + lexeme.length) == rule) {
        return candidates.push([name, lexeme, valueFn(lexeme)]);
      }
    });
    return candidates;
  }
  __name(possible, "possible");
}
__name(tokenGenerator, "tokenGenerator");

// src/lib/parser.ts
var Parser = class {
  constructor(stream) {
    this.current = 0;
    this.tokens = stream.drain();
  }
  parse() {
    return this.tokens;
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
  check(name) {
    var _a;
    return ((_a = this.peek()) == null ? void 0 : _a.name) == name;
  }
  atEnd() {
    return !this.peek().name;
  }
  advance() {
    if (!this.atEnd())
      this.current++;
    return this.previous();
  }
  peek() {
    return this.tokens[this.current];
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  consume(name, message) {
    if (this.check(name))
      this.advance();
    else
      throw `Error: ${this.peek()} ${message}`;
  }
};
__name(Parser, "Parser");

// package.json
var version = "2022.06.23";

// src/stoa.ts
function stringScanner(value) {
  const tokenizer = new TokenStream(value, {
    SINGLE: "'",
    DOUBLE: '"',
    ESCAPED_CHAR: /\\./,
    CHAR: /./
  });
  const opener = tokenizer.take();
  if (["SINGLE", "DOUBLE"].includes(opener == null ? void 0 : opener.name)) {
    let closer, text = opener.text;
    while (closer = tokenizer.take()) {
      text += closer.text;
      if (closer.name == opener.name)
        return text;
    }
  }
}
__name(stringScanner, "stringScanner");
var [LoxScanner, Lx] = TokenStreamClassFactory.build({
  NIL: "nil",
  TRUE: "true",
  FALSE: "false",
  PLUS: "+",
  DASH: "-",
  STAR: "*",
  SLASH: "/",
  EQUAL: "=",
  AND: /and/i,
  OR: /or/i,
  NOT: /not/i,
  VAR: /var/i,
  SEMICOLON: ";",
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_CURL: "{",
  RIGHT_CURL: "}",
  SUPER: "super",
  EQUAL_EQUAL: "==",
  BANG_EQUAL: "!=",
  BANG: "!",
  COMMA: ",",
  LESS: "<",
  GREATER: ">",
  LESS_EQUAL: "<=",
  GREATER_EQUAL: ">=",
  IDENTIFIER: /[a-z][a-z\d]*/i,
  THIS: "this",
  DOT: ".",
  NUMBER: [/\d+(\.\d*)?/, (text) => parseFloat(text)],
  STRING: [stringScanner, (text) => text.substring(1, text.length - 1)],
  PRINT: /print/i,
  FOR: /for/i,
  WHILE: /while/i,
  CLASS: /class/i,
  IF: /if/i,
  ELSE: /else/i,
  FUN: /fun/i,
  RETURN: /return/i,
  _COMMENT: [/\/\/.*/, (text) => text.substring(2).trim()],
  _SPACE: /\s+/
});
var LoxParser = class extends Parser {
  constructor(stream) {
    super(stream);
  }
  parse() {
    if (!this._parsed)
      this._parsed = this.Expression();
    return this._parsed;
  }
  Expression() {
    return this.Equality();
  }
  Equality() {
    let expr = this.Comparison();
    while (this.match(Lx.BANG_EQUAL, Lx.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.Comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Comparison() {
    let expr = this.Term();
    while (this.match(Lx.LESS, Lx.GREATER, Lx.LESS_EQUAL, Lx.GREATER_EQUAL)) {
      const operator = this.previous();
      const right = this.Term();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Term() {
    let expr = this.Factor();
    while (this.match(Lx.PLUS, Lx.DASH)) {
      const operator = this.previous();
      const right = this.Factor();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Factor() {
    let expr = this.Unary();
    while (this.match(Lx.STAR, Lx.SLASH)) {
      const operator = this.previous();
      const right = this.Unary();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Unary() {
    if (this.match(Lx.BANG, Lx.DASH)) {
      const operator = this.previous();
      const right = this.Unary();
      return new Unary(operator, right);
    }
    return this.Primary();
  }
  Primary() {
    if (this.match(Lx.NUMBER, Lx.STRING, Lx.TRUE, Lx.FALSE, Lx.NIL)) {
      return new Literal(this.previous().value);
    }
    if (this.match(Lx.LEFT_PAREN)) {
      const expr = this.Expression();
      this.consume(Lx.RIGHT_PAREN, 'Expected ")" after expression');
      return new Grouping(expr);
    }
    throw `Expected expression at ${this.peek()}`;
  }
};
__name(LoxParser, "LoxParser");
var Literal = class {
  constructor(value) {
    this.value = value;
  }
  accept(visit) {
    return visit.Literal(this);
  }
};
__name(Literal, "Literal");
var Unary = class {
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
  }
  accept(visit) {
    return visit.Unary(this);
  }
};
__name(Unary, "Unary");
var Binary = class {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visit) {
    return visit.Binary(this);
  }
};
__name(Binary, "Binary");
var Grouping = class {
  constructor(inner) {
    this.inner = inner;
  }
  accept(visit) {
    return visit.Grouping(this);
  }
};
__name(Grouping, "Grouping");
var LoxPrettyPrinter = class {
  Literal(expr) {
    return JSON.stringify(expr.value);
  }
  Unary(expr) {
    return `(${expr.operator.text} ${expr.right.accept(this)})`;
  }
  Binary(expr) {
    return `(${expr.operator.text} ${expr.left.accept(this)} ${expr.right.accept(this)})`;
  }
  Grouping(expr) {
    return `${expr.inner.accept(this)}`;
  }
};
__name(LoxPrettyPrinter, "LoxPrettyPrinter");
var LoxEvaluator = class {
  Literal(expr) {
    return JSON.parse(JSON.stringify(expr.value));
  }
  Unary(expr) {
    const value = expr.right.accept(this);
    if (expr.operator.text == "!")
      return !value;
    if (expr.operator.text == "-")
      return -value;
    throw "Unexpected Unary Operator";
  }
  Binary(expr) {
    const left = expr.left.accept(this);
    const right = expr.right.accept(this);
    if (expr.operator.text == "+")
      return left + right;
    if (expr.operator.text == "-")
      return left - right;
    if (expr.operator.text == "*")
      return left * right;
    if (expr.operator.text == "/")
      return left / right;
    throw "Unexpected Binary Operator";
  }
  Grouping(expr) {
    return expr.inner.accept(this);
  }
};
__name(LoxEvaluator, "LoxEvaluator");
var Lox = new Language(LoxScanner, LoxParser, LoxEvaluator);
new Launcher({
  name: "lox",
  version,
  Formatters: {
    parse(ast) {
      return ast.accept(new LoxPrettyPrinter());
    }
  }
}).drive(Lox.driver);
