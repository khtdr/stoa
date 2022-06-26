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
var Cli = class {
  constructor(config) {
    this.config = config;
    this.output = "evaluate";
    this.runFile = false;
    this.runRepl = false;
    this.runPipe = false;
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
    this.showVersion = !!opts.get("version");
  }
  run(runner) {
    if (this.showVersion) {
      console.log(`${this.config.name}-${this.config.version}`);
      process.exit(0);
    }
    runner.output = this.output;
    runner.formatter = Formatters[this.output];
    if (this.runFile)
      runner.run((0, import_fs.readFileSync)((0, import_path.resolve)(this.runFile)).toString());
    if (this.runPipe)
      runner.run((0, import_fs.readFileSync)("/dev/stdin").toString());
    process.exit(runner.status);
  }
};
__name(Cli, "Cli");
var Formatters = class {
  static tokenize(tokens) {
    console.log(tokens.map((t) => t.toString()));
  }
  static parse(out) {
    console.log(out);
  }
  static evaluate(out) {
    console.log(out);
  }
};
__name(Formatters, "Formatters");

// src/lib/language.ts
var LanguageFactory = class {
  static build(args) {
    const engine = new LanguageEngine(args.TokenizerClass);
    const driver = new LanguageDriver(engine);
    return { engine, driver };
  }
};
__name(LanguageFactory, "LanguageFactory");
var LanguageDriver = class {
  constructor(lang) {
    this.lang = lang;
    this.status = 0;
    this.output = "evaluate";
    this.formatter = () => {
    };
  }
  run(program) {
    const value = this.lang[this.output](program);
    this.formatter(value);
  }
};
__name(LanguageDriver, "LanguageDriver");
var LanguageEngine = class {
  constructor(TokenizerClass) {
    this.TokenizerClass = TokenizerClass;
  }
  tokenize(source) {
    return new this.TokenizerClass(source).tokens;
  }
  parse(source) {
    return this.tokenize(source);
  }
  evaluate(source) {
    return this.tokenize(source);
  }
};
__name(LanguageEngine, "LanguageEngine");

// src/lib/tokenizer.ts
var Token = class {
  constructor(name, text, value, pos) {
    this.name = name;
    this.text = text;
    this.value = value;
    this.pos = pos;
  }
  toString() {
    return JSON.stringify(this);
  }
};
__name(Token, "Token");
var Tokenizer = class {
  constructor(dict, source) {
    this.dict = dict;
    this.source = source;
    this._tokens = [];
    this.idx = 0;
    this.line = 1;
    this.column = 1;
  }
  get tokens() {
    if (!this._tokens.length)
      this.scan();
    return this._tokens;
  }
  scan() {
    this.idx = 0;
    this.line = 1;
    this.column = 1;
    while (this.idx < this.source.length) {
      const [name, text = this.source[this.idx], value] = this.longest(this.possible());
      if (!name)
        this._tokens.push(this.error(text));
      else
        this._tokens.push(new Token(name, text, value, this.pos()));
      const lines = text.split("\n").length;
      if (lines > 1) {
        this.line += lines - 1;
        this.column = text.length - text.lastIndexOf("\n");
      } else
        this.column += text.length;
      this.idx += text.length;
    }
  }
  error(text) {
    this.errors = this.errors || [];
    const token = new Token("_stoa_::error", text, void 0, this.pos());
    this.errors.push(token);
    return token;
  }
  pos() {
    return { line: this.line, column: this.column };
  }
  longest(candidates) {
    if (!candidates.length)
      return [];
    return candidates.reduce((longest, current) => current[1].length > longest[1].length ? current : longest);
  }
  possible() {
    const candidates = [];
    Object.entries(this.dict).map(([name, rule]) => {
      const [lexeme, valueFn = /* @__PURE__ */ __name((val) => val, "valueFn")] = Array.isArray(rule) ? rule : [rule];
      if (typeof lexeme == "function") {
        const text = lexeme(this.source.substring(this.idx));
        if (text)
          candidates.push([name, text, valueFn(text)]);
      } else if (typeof lexeme != "string") {
        const regex = new RegExp(`^${lexeme.source}`, lexeme.flags);
        const match = regex.exec(this.source.substring(this.idx));
        if (match)
          return candidates.push([name, match[0], valueFn(match[0])]);
      } else if (this.source.substring(this.idx, this.idx + lexeme.length) == rule) {
        return candidates.push([name, lexeme, valueFn(lexeme)]);
      }
    });
    return candidates;
  }
};
__name(Tokenizer, "Tokenizer");
var TokenizerClassFactory = class {
  static build(dict) {
    class TokenizerClassFactoryClass extends Tokenizer {
      constructor(source) {
        super(dict, source);
      }
    }
    __name(TokenizerClassFactoryClass, "TokenizerClassFactoryClass");
    return TokenizerClassFactoryClass;
  }
};
__name(TokenizerClassFactory, "TokenizerClassFactory");

// package.json
var version = "2022.06.23";

// src/stoa.ts
var APP = { name: "stoa", version };
var StringTokenizer = TokenizerClassFactory.build({
  SINGLE: "'",
  DOUBLE: '"',
  ESCAPED_CHAR: /\\./,
  CHAR: /./
});
function isString(value) {
  const tokenizer = new StringTokenizer(value);
  const [first] = tokenizer.tokens;
  if (!["SINGLE", "DOUBLE"].includes(first == null ? void 0 : first.name))
    return void 0;
  let text = first.text, i = 1;
  while (true) {
    const next = tokenizer.tokens[i++];
    if (!next)
      return void 0;
    text += next.text;
    if (next.name == first.name)
      return text;
  }
}
__name(isString, "isString");
var STOA = LanguageFactory.build({
  TokenizerClass: TokenizerClassFactory.build({
    LEFT_ARROW: "<-",
    RIGHT_FAT_ARROW: "=>",
    DOUBLE_SQUIRT: "~~",
    COLON: ":",
    DOT: ".",
    EQUAL: "=",
    LEFT_ANGLE: "<",
    LEFT_PAREN: "(",
    MINUS: "-",
    PLUS: "+",
    POUND: "#",
    QUESTION: "?",
    RIGHT_ANGLE: ">",
    RIGHT_PAREN: ")",
    SLASH: "/",
    STAR: "*",
    IDENTIFIER: /[a-z][a-z\d]*/i,
    DIGITS: [/\d+/, (text) => parseInt(text, 10)],
    SPACE: /\s+/,
    COMMENT: [/;;.*/, (text) => text.substring(2).trim()],
    STRING: [isString, (text) => text.substring(1, text.length - 1)]
  })
});
new Cli(APP).run(STOA.driver);
