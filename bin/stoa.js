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
        var name2 = opt2[type];
        if (!opts2[prefix + name2]) {
          opts2[prefix + name2] = opt2;
        } else {
          if (opt2.namespace && !opts2[prefix + opt2.namespace + "." + name2]) {
            opts2[prefix + opt2.namespace + "." + name2] = opt2;
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
            puts("Conflicting flags: " + prefix + name2 + "\n");
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
      return Object.keys(values).reduce(function(dict, name2) {
        name2 = name2.replace("/^-+/", "");
        dict[name2] = exports.get(name2);
        return dict;
      }, {});
    };
    exports.args = function() {
      return argv;
    };
    exports.arg = function(name2) {
      return args[name2];
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

// node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/.pnpm/ms@2.0.0/node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    __name(parse2, "parse");
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    __name(fmtShort, "fmtShort");
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    __name(fmtLong, "fmtLong");
    function plural(ms, n, name2) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name2;
      }
      return Math.ceil(ms / n) + " " + name2 + "s";
    }
    __name(plural, "plural");
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/debug.js"(exports, module2) {
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    __name(selectColor, "selectColor");
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled)
          return;
        var self2 = debug;
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%")
            return match;
          index++;
          var formatter = exports.formatters[format];
          if (typeof formatter === "function") {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      __name(debug, "debug");
      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      if (typeof exports.init === "function") {
        exports.init(debug);
      }
      return debug;
    }
    __name(createDebug, "createDebug");
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i])
          continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    __name(enable, "enable");
    function disable() {
      exports.enable("");
    }
    __name(disable, "disable");
    function enabled(name2) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name2)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name2)) {
          return true;
        }
      }
      return false;
    }
    __name(enabled, "enabled");
    function coerce(val) {
      if (val instanceof Error)
        return val.stack || val.message;
      return val;
    }
    __name(coerce, "coerce");
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/browser.js"(exports, module2) {
    exports = module2.exports = require_debug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = typeof chrome != "undefined" && typeof chrome.storage != "undefined" ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    __name(useColors, "useColors");
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2)
        return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if (match === "%%")
          return;
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    __name(formatArgs, "formatArgs");
    function log() {
      return typeof console === "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    __name(log, "log");
    function save(namespaces) {
      try {
        if (namespaces == null) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    __name(save, "save");
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    __name(load, "load");
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
    __name(localstorage, "localstorage");
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util = require("util");
    exports = module2.exports = require_debug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val))
        val = true;
      else if (/^(no|off|false|disabled)$/i.test(val))
        val = false;
      else if (val === "null")
        val = null;
      else
        val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (fd !== 1 && fd !== 2) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = fd === 1 ? process.stdout : fd === 2 ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    __name(useColors, "useColors");
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name2 = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name2 + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = new Date().toUTCString() + " " + name2 + " " + args[0];
      }
    }
    __name(formatArgs, "formatArgs");
    function log() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    __name(log, "log");
    function save(namespaces) {
      if (namespaces == null) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    __name(save, "save");
    function load() {
      return process.env.DEBUG;
    }
    __name(load, "load");
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require("fs");
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require("net");
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    __name(createWritableStdioStream, "createWritableStdioStream");
    function init(debug) {
      debug.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    __name(init, "init");
    exports.enable(load());
  }
});

// node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/debug@2.6.9/node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process !== "undefined" && process.type === "renderer") {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/.pnpm/component-emitter@1.3.0/node_modules/component-emitter/index.js
var require_component_emitter = __commonJS({
  "node_modules/.pnpm/component-emitter@1.3.0/node_modules/component-emitter/index.js"(exports, module2) {
    if (typeof module2 !== "undefined") {
      module2.exports = Emitter;
    }
    function Emitter(obj) {
      if (obj)
        return mixin(obj);
    }
    __name(Emitter, "Emitter");
    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }
    __name(mixin, "mixin");
    Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
      return this;
    };
    Emitter.prototype.once = function(event, fn) {
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }
      __name(on, "on");
      on.fn = fn;
      this.on(event, on);
      return this;
    };
    Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (arguments.length == 0) {
        this._callbacks = {};
        return this;
      }
      var callbacks = this._callbacks["$" + event];
      if (!callbacks)
        return this;
      if (arguments.length == 1) {
        delete this._callbacks["$" + event];
        return this;
      }
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      if (callbacks.length === 0) {
        delete this._callbacks["$" + event];
      }
      return this;
    };
    Emitter.prototype.emit = function(event) {
      this._callbacks = this._callbacks || {};
      var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }
      return this;
    };
    Emitter.prototype.listeners = function(event) {
      this._callbacks = this._callbacks || {};
      return this._callbacks["$" + event] || [];
    };
    Emitter.prototype.hasListeners = function(event) {
      return !!this.listeners(event).length;
    };
  }
});

// node_modules/.pnpm/ansi-regex@3.0.1/node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/.pnpm/ansi-regex@3.0.1/node_modules/ansi-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = () => {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[a-zA-Z\\d]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, "g");
    };
  }
});

// node_modules/.pnpm/strip-ansi@4.0.0/node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/.pnpm/strip-ansi@4.0.0/node_modules/strip-ansi/index.js"(exports, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    module2.exports = (input) => typeof input === "string" ? input.replace(ansiRegex(), "") : input;
  }
});

// node_modules/.pnpm/is-fullwidth-code-point@2.0.0/node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS({
  "node_modules/.pnpm/is-fullwidth-code-point@2.0.0/node_modules/is-fullwidth-code-point/index.js"(exports, module2) {
    "use strict";
    module2.exports = (x) => {
      if (Number.isNaN(x)) {
        return false;
      }
      if (x >= 4352 && (x <= 4447 || x === 9001 || x === 9002 || 11904 <= x && x <= 12871 && x !== 12351 || 12880 <= x && x <= 19903 || 19968 <= x && x <= 42182 || 43360 <= x && x <= 43388 || 44032 <= x && x <= 55203 || 63744 <= x && x <= 64255 || 65040 <= x && x <= 65049 || 65072 <= x && x <= 65131 || 65281 <= x && x <= 65376 || 65504 <= x && x <= 65510 || 110592 <= x && x <= 110593 || 127488 <= x && x <= 127569 || 131072 <= x && x <= 262141)) {
        return true;
      }
      return false;
    };
  }
});

// node_modules/.pnpm/string-width@2.1.1/node_modules/string-width/index.js
var require_string_width = __commonJS({
  "node_modules/.pnpm/string-width@2.1.1/node_modules/string-width/index.js"(exports, module2) {
    "use strict";
    var stripAnsi = require_strip_ansi();
    var isFullwidthCodePoint = require_is_fullwidth_code_point();
    module2.exports = (str) => {
      if (typeof str !== "string" || str.length === 0) {
        return 0;
      }
      str = stripAnsi(str);
      let width = 0;
      for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code <= 31 || code >= 127 && code <= 159) {
          continue;
        }
        if (code >= 768 && code <= 879) {
          continue;
        }
        if (code > 65535) {
          i++;
        }
        width += isFullwidthCodePoint(code) ? 2 : 1;
      }
      return width;
    };
  }
});

// node_modules/.pnpm/koalas@1.0.2/node_modules/koalas/index.js
var require_koalas = __commonJS({
  "node_modules/.pnpm/koalas@1.0.2/node_modules/koalas/index.js"(exports, module2) {
    "use strict";
    function koalas() {
      var len = arguments.length;
      var arg2;
      for (var i = 0; i < len; i++) {
        arg2 = arguments[i];
        if (hasValue(arg2)) {
          return arg2;
        }
      }
      return arg2;
    }
    __name(koalas, "koalas");
    function hasValue(val) {
      return val != null && val === val;
    }
    __name(hasValue, "hasValue");
    module2.exports = koalas;
  }
});

// node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js"(exports, module2) {
    module2.exports = function(obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    __name(isBuffer, "isBuffer");
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
    }
    __name(isSlowBuffer, "isSlowBuffer");
  }
});

// node_modules/.pnpm/kind-of@3.2.2/node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "node_modules/.pnpm/kind-of@3.2.2/node_modules/kind-of/index.js"(exports, module2) {
    var isBuffer = require_is_buffer();
    var toString = Object.prototype.toString;
    module2.exports = /* @__PURE__ */ __name(function kindOf(val) {
      if (typeof val === "undefined") {
        return "undefined";
      }
      if (val === null) {
        return "null";
      }
      if (val === true || val === false || val instanceof Boolean) {
        return "boolean";
      }
      if (typeof val === "string" || val instanceof String) {
        return "string";
      }
      if (typeof val === "number" || val instanceof Number) {
        return "number";
      }
      if (typeof val === "function" || val instanceof Function) {
        return "function";
      }
      if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
        return "array";
      }
      if (val instanceof RegExp) {
        return "regexp";
      }
      if (val instanceof Date) {
        return "date";
      }
      var type = toString.call(val);
      if (type === "[object RegExp]") {
        return "regexp";
      }
      if (type === "[object Date]") {
        return "date";
      }
      if (type === "[object Arguments]") {
        return "arguments";
      }
      if (type === "[object Error]") {
        return "error";
      }
      if (isBuffer(val)) {
        return "buffer";
      }
      if (type === "[object Set]") {
        return "set";
      }
      if (type === "[object WeakSet]") {
        return "weakset";
      }
      if (type === "[object Map]") {
        return "map";
      }
      if (type === "[object WeakMap]") {
        return "weakmap";
      }
      if (type === "[object Symbol]") {
        return "symbol";
      }
      if (type === "[object Int8Array]") {
        return "int8array";
      }
      if (type === "[object Uint8Array]") {
        return "uint8array";
      }
      if (type === "[object Uint8ClampedArray]") {
        return "uint8clampedarray";
      }
      if (type === "[object Int16Array]") {
        return "int16array";
      }
      if (type === "[object Uint16Array]") {
        return "uint16array";
      }
      if (type === "[object Int32Array]") {
        return "int32array";
      }
      if (type === "[object Uint32Array]") {
        return "uint32array";
      }
      if (type === "[object Float32Array]") {
        return "float32array";
      }
      if (type === "[object Float64Array]") {
        return "float64array";
      }
      return "object";
    }, "kindOf");
  }
});

// node_modules/.pnpm/is-number@3.0.0/node_modules/is-number/index.js
var require_is_number = __commonJS({
  "node_modules/.pnpm/is-number@3.0.0/node_modules/is-number/index.js"(exports, module2) {
    "use strict";
    var typeOf = require_kind_of();
    module2.exports = /* @__PURE__ */ __name(function isNumber2(num) {
      var type = typeOf(num);
      if (type === "string") {
        if (!num.trim())
          return false;
      } else if (type !== "number") {
        return false;
      }
      return num - num + 1 >= 0;
    }, "isNumber");
  }
});

// node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js
var require_kind_of2 = __commonJS({
  "node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js"(exports, module2) {
    var toString = Object.prototype.toString;
    module2.exports = /* @__PURE__ */ __name(function kindOf(val) {
      if (val === void 0)
        return "undefined";
      if (val === null)
        return "null";
      var type = typeof val;
      if (type === "boolean")
        return "boolean";
      if (type === "string")
        return "string";
      if (type === "number")
        return "number";
      if (type === "symbol")
        return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val))
        return "array";
      if (isBuffer(val))
        return "buffer";
      if (isArguments(val))
        return "arguments";
      if (isDate(val))
        return "date";
      if (isError(val))
        return "error";
      if (isRegexp(val))
        return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    }, "kindOf");
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    __name(ctorName, "ctorName");
    function isArray(val) {
      if (Array.isArray)
        return Array.isArray(val);
      return val instanceof Array;
    }
    __name(isArray, "isArray");
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    __name(isError, "isError");
    function isDate(val) {
      if (val instanceof Date)
        return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    __name(isDate, "isDate");
    function isRegexp(val) {
      if (val instanceof RegExp)
        return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    __name(isRegexp, "isRegexp");
    function isGeneratorFn(name2, val) {
      return ctorName(name2) === "GeneratorFunction";
    }
    __name(isGeneratorFn, "isGeneratorFn");
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    __name(isGeneratorObj, "isGeneratorObj");
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    __name(isArguments, "isArguments");
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
    __name(isBuffer, "isBuffer");
  }
});

// node_modules/.pnpm/is-accessor-descriptor@1.0.0/node_modules/is-accessor-descriptor/index.js
var require_is_accessor_descriptor = __commonJS({
  "node_modules/.pnpm/is-accessor-descriptor@1.0.0/node_modules/is-accessor-descriptor/index.js"(exports, module2) {
    "use strict";
    var typeOf = require_kind_of2();
    var accessor = {
      get: "function",
      set: "function",
      configurable: "boolean",
      enumerable: "boolean"
    };
    function isAccessorDescriptor(obj, prop) {
      if (typeof prop === "string") {
        var val = Object.getOwnPropertyDescriptor(obj, prop);
        return typeof val !== "undefined";
      }
      if (typeOf(obj) !== "object") {
        return false;
      }
      if (has(obj, "value") || has(obj, "writable")) {
        return false;
      }
      if (!has(obj, "get") || typeof obj.get !== "function") {
        return false;
      }
      if (has(obj, "set") && typeof obj[key] !== "function" && typeof obj[key] !== "undefined") {
        return false;
      }
      for (var key in obj) {
        if (!accessor.hasOwnProperty(key)) {
          continue;
        }
        if (typeOf(obj[key]) === accessor[key]) {
          continue;
        }
        if (typeof obj[key] !== "undefined") {
          return false;
        }
      }
      return true;
    }
    __name(isAccessorDescriptor, "isAccessorDescriptor");
    function has(obj, key) {
      return {}.hasOwnProperty.call(obj, key);
    }
    __name(has, "has");
    module2.exports = isAccessorDescriptor;
  }
});

// node_modules/.pnpm/is-data-descriptor@1.0.0/node_modules/is-data-descriptor/index.js
var require_is_data_descriptor = __commonJS({
  "node_modules/.pnpm/is-data-descriptor@1.0.0/node_modules/is-data-descriptor/index.js"(exports, module2) {
    "use strict";
    var typeOf = require_kind_of2();
    module2.exports = /* @__PURE__ */ __name(function isDataDescriptor(obj, prop) {
      var data = {
        configurable: "boolean",
        enumerable: "boolean",
        writable: "boolean"
      };
      if (typeOf(obj) !== "object") {
        return false;
      }
      if (typeof prop === "string") {
        var val = Object.getOwnPropertyDescriptor(obj, prop);
        return typeof val !== "undefined";
      }
      if (!("value" in obj) && !("writable" in obj)) {
        return false;
      }
      for (var key in obj) {
        if (key === "value")
          continue;
        if (!data.hasOwnProperty(key)) {
          continue;
        }
        if (typeOf(obj[key]) === data[key]) {
          continue;
        }
        if (typeof obj[key] !== "undefined") {
          return false;
        }
      }
      return true;
    }, "isDataDescriptor");
  }
});

// node_modules/.pnpm/is-descriptor@1.0.2/node_modules/is-descriptor/index.js
var require_is_descriptor = __commonJS({
  "node_modules/.pnpm/is-descriptor@1.0.2/node_modules/is-descriptor/index.js"(exports, module2) {
    "use strict";
    var typeOf = require_kind_of2();
    var isAccessor = require_is_accessor_descriptor();
    var isData = require_is_data_descriptor();
    module2.exports = /* @__PURE__ */ __name(function isDescriptor(obj, key) {
      if (typeOf(obj) !== "object") {
        return false;
      }
      if ("get" in obj) {
        return isAccessor(obj, key);
      }
      return isData(obj, key);
    }, "isDescriptor");
  }
});

// node_modules/.pnpm/define-property@1.0.0/node_modules/define-property/index.js
var require_define_property = __commonJS({
  "node_modules/.pnpm/define-property@1.0.0/node_modules/define-property/index.js"(exports, module2) {
    "use strict";
    var isDescriptor = require_is_descriptor();
    module2.exports = /* @__PURE__ */ __name(function defineProperty(obj, prop, val) {
      if (typeof obj !== "object" && typeof obj !== "function") {
        throw new TypeError("expected an object or function.");
      }
      if (typeof prop !== "string") {
        throw new TypeError("expected `prop` to be a string.");
      }
      if (isDescriptor(val) && ("set" in val || "get" in val)) {
        return Object.defineProperty(obj, prop, val);
      }
      return Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: val
      });
    }, "defineProperty");
  }
});

// node_modules/.pnpm/window-size@1.1.1/node_modules/window-size/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/window-size@1.1.1/node_modules/window-size/utils.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var isNumber2 = require_is_number();
    var cp = require("child_process");
    function windowSize(options) {
      options = options || {};
      return streamSize(options, "stdout") || streamSize(options, "stderr") || envSize() || ttySize(options);
    }
    __name(windowSize, "windowSize");
    function streamSize(options, name2) {
      var stream = process && process[name2] || options[name2];
      var size;
      if (!stream)
        return;
      if (typeof stream.getWindowSize === "function") {
        size = stream.getWindowSize();
        if (isSize(size)) {
          return {
            width: size[0],
            height: size[1],
            type: name2
          };
        }
      }
      size = [stream.columns, stream.rows];
      if (isSize(size)) {
        return {
          width: Number(size[0]),
          height: Number(size[1]),
          type: name2
        };
      }
    }
    __name(streamSize, "streamSize");
    function envSize() {
      if (process && process.env) {
        var size = [process.env.COLUMNS, process.env.ROWS];
        if (isSize(size)) {
          return {
            width: Number(size[0]),
            height: Number(size[1]),
            type: "process.env"
          };
        }
      }
    }
    __name(envSize, "envSize");
    function ttySize(options, stdout) {
      var tty = options.tty || require("tty");
      if (tty && typeof tty.getWindowSize === "function") {
        var size = tty.getWindowSize(stdout);
        if (isSize(size)) {
          return {
            width: Number(size[1]),
            height: Number(size[0]),
            type: "tty"
          };
        }
      }
    }
    __name(ttySize, "ttySize");
    function winSize() {
      if (os.release().startsWith("10")) {
        var cmd = "wmic path Win32_VideoController get CurrentHorizontalResolution,CurrentVerticalResolution";
        var numberPattern = /\d+/g;
        var code = cp.execSync(cmd).toString();
        var size = code.match(numberPattern);
        if (isSize(size)) {
          return {
            width: Number(size[0]),
            height: Number(size[1]),
            type: "windows"
          };
        }
      }
    }
    __name(winSize, "winSize");
    function tputSize() {
      try {
        var buf = cp.execSync("tput cols && tput lines", { stdio: ["ignore", "pipe", process.stderr] });
        var size = buf.toString().trim().split("\n");
        if (isSize(size)) {
          return {
            width: Number(size[0]),
            height: Number(size[1]),
            type: "tput"
          };
        }
      } catch (err) {
      }
    }
    __name(tputSize, "tputSize");
    function isSize(size) {
      return Array.isArray(size) && isNumber2(size[0]) && isNumber2(size[1]);
    }
    __name(isSize, "isSize");
    module2.exports = {
      get: windowSize,
      env: envSize,
      tty: ttySize,
      tput: tputSize,
      win: winSize
    };
  }
});

// node_modules/.pnpm/window-size@1.1.1/node_modules/window-size/index.js
var require_window_size = __commonJS({
  "node_modules/.pnpm/window-size@1.1.1/node_modules/window-size/index.js"(exports, module2) {
    "use strict";
    var define2 = require_define_property();
    var utils = require_utils();
    module2.exports = utils.get();
    if (module2.exports) {
      define2(module2.exports, "get", utils.get);
      define2(module2.exports, "env", utils.env);
      define2(module2.exports, "tty", utils.tty);
      define2(module2.exports, "tput", utils.tput);
      define2(module2.exports, "win", utils.win);
    }
  }
});

// node_modules/.pnpm/arr-flatten@1.1.0/node_modules/arr-flatten/index.js
var require_arr_flatten = __commonJS({
  "node_modules/.pnpm/arr-flatten@1.1.0/node_modules/arr-flatten/index.js"(exports, module2) {
    "use strict";
    module2.exports = function(arr) {
      return flat(arr, []);
    };
    function flat(arr, res) {
      var i = 0, cur;
      var len = arr.length;
      for (; i < len; i++) {
        cur = arr[i];
        Array.isArray(cur) ? flat(cur, res) : res.push(cur);
      }
      return res;
    }
    __name(flat, "flat");
  }
});

// node_modules/.pnpm/is-extendable@0.1.1/node_modules/is-extendable/index.js
var require_is_extendable = __commonJS({
  "node_modules/.pnpm/is-extendable@0.1.1/node_modules/is-extendable/index.js"(exports, module2) {
    "use strict";
    module2.exports = /* @__PURE__ */ __name(function isExtendable(val) {
      return typeof val !== "undefined" && val !== null && (typeof val === "object" || typeof val === "function");
    }, "isExtendable");
  }
});

// node_modules/.pnpm/extend-shallow@2.0.1/node_modules/extend-shallow/index.js
var require_extend_shallow = __commonJS({
  "node_modules/.pnpm/extend-shallow@2.0.1/node_modules/extend-shallow/index.js"(exports, module2) {
    "use strict";
    var isObject = require_is_extendable();
    module2.exports = /* @__PURE__ */ __name(function extend(o) {
      if (!isObject(o)) {
        o = {};
      }
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];
        if (isObject(obj)) {
          assign(o, obj);
        }
      }
      return o;
    }, "extend");
    function assign(a, b) {
      for (var key in b) {
        if (hasOwn(b, key)) {
          a[key] = b[key];
        }
      }
    }
    __name(assign, "assign");
    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
    __name(hasOwn, "hasOwn");
  }
});

// node_modules/.pnpm/is-windows@1.0.2/node_modules/is-windows/index.js
var require_is_windows = __commonJS({
  "node_modules/.pnpm/is-windows@1.0.2/node_modules/is-windows/index.js"(exports, module2) {
    (function(factory) {
      if (exports && typeof exports === "object" && typeof module2 !== "undefined") {
        module2.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof window !== "undefined") {
        window.isWindows = factory();
      } else if (typeof global !== "undefined") {
        global.isWindows = factory();
      } else if (typeof self !== "undefined") {
        self.isWindows = factory();
      } else {
        this.isWindows = factory();
      }
    })(function() {
      "use strict";
      return /* @__PURE__ */ __name(function isWindows() {
        return process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE));
      }, "isWindows");
    });
  }
});

// node_modules/.pnpm/mute-stream@0.0.7/node_modules/mute-stream/mute.js
var require_mute = __commonJS({
  "node_modules/.pnpm/mute-stream@0.0.7/node_modules/mute-stream/mute.js"(exports, module2) {
    var Stream = require("stream");
    module2.exports = MuteStream;
    function MuteStream(opts2) {
      Stream.apply(this);
      opts2 = opts2 || {};
      this.writable = this.readable = true;
      this.muted = false;
      this.on("pipe", this._onpipe);
      this.replace = opts2.replace;
      this._prompt = opts2.prompt || null;
      this._hadControl = false;
    }
    __name(MuteStream, "MuteStream");
    MuteStream.prototype = Object.create(Stream.prototype);
    Object.defineProperty(MuteStream.prototype, "constructor", {
      value: MuteStream,
      enumerable: false
    });
    MuteStream.prototype.mute = function() {
      this.muted = true;
    };
    MuteStream.prototype.unmute = function() {
      this.muted = false;
    };
    Object.defineProperty(MuteStream.prototype, "_onpipe", {
      value: onPipe,
      enumerable: false,
      writable: true,
      configurable: true
    });
    function onPipe(src) {
      this._src = src;
    }
    __name(onPipe, "onPipe");
    Object.defineProperty(MuteStream.prototype, "isTTY", {
      get: getIsTTY,
      set: setIsTTY,
      enumerable: true,
      configurable: true
    });
    function getIsTTY() {
      return this._dest ? this._dest.isTTY : this._src ? this._src.isTTY : false;
    }
    __name(getIsTTY, "getIsTTY");
    function setIsTTY(isTTY) {
      Object.defineProperty(this, "isTTY", {
        value: isTTY,
        enumerable: true,
        writable: true,
        configurable: true
      });
    }
    __name(setIsTTY, "setIsTTY");
    Object.defineProperty(MuteStream.prototype, "rows", {
      get: function() {
        return this._dest ? this._dest.rows : this._src ? this._src.rows : void 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MuteStream.prototype, "columns", {
      get: function() {
        return this._dest ? this._dest.columns : this._src ? this._src.columns : void 0;
      },
      enumerable: true,
      configurable: true
    });
    MuteStream.prototype.pipe = function(dest, options) {
      this._dest = dest;
      return Stream.prototype.pipe.call(this, dest, options);
    };
    MuteStream.prototype.pause = function() {
      if (this._src)
        return this._src.pause();
    };
    MuteStream.prototype.resume = function() {
      if (this._src)
        return this._src.resume();
    };
    MuteStream.prototype.write = function(c) {
      if (this.muted) {
        if (!this.replace)
          return true;
        if (c.match(/^\u001b/)) {
          if (c.indexOf(this._prompt) === 0) {
            c = c.substr(this._prompt.length);
            c = c.replace(/./g, this.replace);
            c = this._prompt + c;
          }
          this._hadControl = true;
          return this.emit("data", c);
        } else {
          if (this._prompt && this._hadControl && c.indexOf(this._prompt) === 0) {
            this._hadControl = false;
            this.emit("data", this._prompt);
            c = c.substr(this._prompt.length);
          }
          c = c.toString().replace(/./g, this.replace);
        }
      }
      this.emit("data", c);
    };
    MuteStream.prototype.end = function(c) {
      if (this.muted) {
        if (c && this.replace) {
          c = c.toString().replace(/./g, this.replace);
        } else {
          c = null;
        }
      }
      if (c)
        this.emit("data", c);
      this.emit("end");
    };
    function proxy(fn) {
      return function() {
        var d = this._dest;
        var s = this._src;
        if (d && d[fn])
          d[fn].apply(d, arguments);
        if (s && s[fn])
          s[fn].apply(s, arguments);
      };
    }
    __name(proxy, "proxy");
    MuteStream.prototype.destroy = proxy("destroy");
    MuteStream.prototype.destroySoon = proxy("destroySoon");
    MuteStream.prototype.close = proxy("close");
  }
});

// node_modules/.pnpm/strip-color@0.1.0/node_modules/strip-color/index.js
var require_strip_color = __commonJS({
  "node_modules/.pnpm/strip-color@0.1.0/node_modules/strip-color/index.js"(exports, module2) {
    "use strict";
    module2.exports = function(str) {
      return str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, "");
    };
  }
});

// node_modules/.pnpm/readline-utils@2.2.3/node_modules/readline-utils/index.js
var require_readline_utils = __commonJS({
  "node_modules/.pnpm/readline-utils@2.2.3/node_modules/readline-utils/index.js"(exports, module2) {
    "use strict";
    var koalas = require_koalas();
    var isNum = require_is_number();
    var size = require_window_size();
    var readline = require("readline");
    var isBuffer = require_is_buffer();
    var flatten = require_arr_flatten();
    var extend = require_extend_shallow();
    var isWindows = require_is_windows();
    var MuteStream = require_mute();
    var stripColor = require_strip_color();
    var sizeUtils = require_utils();
    var utils = module2.exports;
    utils.createOptions = function(options) {
      var opts2 = extend({ terminal: true }, options);
      opts2.output = opts2.output || process.stdout;
      opts2.input = opts2.input || process.stdin;
      return opts2;
    };
    utils.createInterface = function(options) {
      var opts2 = utils.createOptions(options);
      var ms = new MuteStream();
      ms.pipe(opts2.output);
      opts2.output = ms;
      return readline.createInterface(opts2);
    };
    utils.up = function(rl, n) {
      readline.moveCursor(rl.output, 0, -(n || 1));
      return this;
    };
    utils.down = function(rl, n) {
      readline.moveCursor(rl.output, 0, n || 1);
      return this;
    };
    utils.left = function(rl, n) {
      readline.moveCursor(rl.output, -(n || 1));
      return this;
    };
    utils.right = function(rl, n) {
      readline.moveCursor(rl.output, n || 1);
      return this;
    };
    utils.move = function(rl, key, n) {
      if (key && exports[key.name]) {
        exports[key.name](rl, n);
      }
      return this;
    };
    utils.auto = function(rl) {
      return function(s, key) {
        utils.move(rl, key);
      };
    };
    utils.clearLine = function(rl, n) {
      rl.output.write(utils.eraseLines(n));
      return this;
    };
    utils.clearAfter = function(rl, n) {
      utils.clearLine(rl, n || 1);
      return this;
    };
    utils.clearScreen = function(rl) {
      rl.write(null, { ctrl: true, name: "l" });
      return this;
    };
    utils.lastLine = function(str) {
      return last(str.split("\n"));
    };
    utils.height = function(str) {
      return str.split("\n").length;
    };
    utils.hideCursor = utils.cursorHide = function(rl) {
      rl.output.write("\x1B[?25l");
      return this;
    };
    utils.showCursor = utils.cursorShow = function(rl) {
      rl.output.write("\x1B[?25h");
      return this;
    };
    utils.close = function(rl, fn) {
      fn = fn || utils.forceClose.bind(exports, rl);
      process.removeListener("exit", fn);
      rl.removeListener("SIGINT", fn);
      if (typeof rl.output.unmute === "function") {
        rl.output.unmute();
        rl.output.end();
      }
      rl.pause();
      rl.close();
      return this;
    };
    utils.forceClose = function(rl) {
      utils.close(rl);
      return this;
    };
    utils.eraseLines = function(n) {
      var num = toNumber(n);
      var lines = "";
      var i = -1;
      while (++i < num) {
        lines += "\x1B[1000D\x1B[K";
        if (i < num - 1) {
          lines += "\x1B[1A";
        }
      }
      return lines;
    };
    utils.clearTrailingLines = function(rl, lines, height) {
      if (!isNumber2(lines))
        lines = 0;
      var len = height + lines;
      while (len--) {
        readline.moveCursor(rl.output, -utils.cliWidth(80), 0);
        readline.clearLine(rl.output, 0);
        if (len)
          readline.moveCursor(rl.output, 0, -1);
      }
      return this;
    };
    utils.cursorPosition = function(rl) {
      return rl._getCursorPos();
    };
    utils.restoreCursorPos = function(rl, cursorPos) {
      if (!cursorPos)
        return;
      var line = rl._prompt + rl.line;
      readline.moveCursor(rl.output, -line.length, 0);
      readline.moveCursor(rl.output, cursorPos.cols, 0);
      cursorPos = null;
      return this;
    };
    utils.cliWidth = function(fallback) {
      var windows = isWindows();
      var modifier = windows ? 1 : 0;
      size = size || (windows ? sizeUtils.win() : sizeUtils.tput());
      return koalas(size && size.width, fallback, modifier) - modifier;
    };
    utils.breakLines = function(lines, width) {
      var quantifier = "";
      if (width > 1) {
        quantifier = "{1," + width + "}";
      }
      var regex = new RegExp("(?:(?:\\033[[0-9;]*m)*.?)" + quantifier, "g");
      return lines.map(function(line) {
        var matches = line.match(regex);
        if (!matches)
          return "";
        matches.pop();
        return matches || "";
      });
    };
    utils.forceLineReturn = function(lines, width) {
      if (typeof lines === "string") {
        lines = utils.breakLines(lines.split("\n"), width);
      }
      return flatten(lines).join("\n");
    };
    utils.normalizeLF = function(str) {
      if (str.slice(-1) !== "\n") {
        str += "\n";
      }
      return str;
    };
    utils.unstyle = function(str) {
      return stripColor(str);
    };
    utils.keypress = function(stream) {
      var StringDecoder = require("string_decoder").StringDecoder;
      stream._keypressDecoder = new StringDecoder("utf8");
      function onData(b) {
        if (stream.listenerCount("keypress") > 0) {
          var r = stream._keypressDecoder.write(b);
          if (r)
            utils.emitKeypress(stream, r);
        } else {
          stream.removeListener("data", onData);
          stream.on("newListener", onNewListener);
        }
      }
      __name(onData, "onData");
      function onNewListener(event) {
        if (event === "keypress") {
          stream.on("data", onData);
          stream.removeListener("newListener", onNewListener);
        }
      }
      __name(onNewListener, "onNewListener");
      if (stream.listenerCount("keypress") > 0) {
        stream.on("data", onData);
      } else {
        stream.on("newListener", onNewListener);
      }
    };
    utils.enableMouse = function(stream) {
      stream.write("\x1B[?1000h");
    };
    utils.disableMouse = function(stream) {
      stream.write("\x1B[?1000l");
    };
    utils.normalize = function(s, key) {
      var metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
      var functionKeyCodeRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
      var events = [];
      var parts;
      var ch = s;
      key = extend({
        name: void 0,
        ctrl: false,
        meta: false,
        shift: false,
        value: s
      }, key);
      if (s === null && key.name === "down") {
        key.ctrl = true;
        s = "n";
      }
      if (s === null && key.name === "up") {
        key.ctrl = true;
        s = "p";
      }
      if (isBuffer(s)) {
        if (s[0] > 127 && s[1] === void 0) {
          s[0] -= 128;
          s = "\x1B" + s.toString();
        } else {
          s = s.toString();
        }
      }
      if (!s && key && key.sequence) {
        s = key.sequence;
      }
      if (typeof s === "number") {
        s = String(s);
        key.value = Number(s);
        key.name = "number";
      }
      key.sequence = String(s);
      if (s === "\r") {
        key.name = "return";
      } else if (s === "\n") {
        key.name = "enter";
      } else if (s === "	") {
        key.name = "tab";
      } else if (s === "\b" || s === "\x7F" || s === "\x1B\x7F" || s === "\x1B\b") {
        key.name = "backspace";
        key.meta = s.charAt(0) === "\x1B";
      } else if (s === "\x1B" || s === "\x1B\x1B") {
        key.name = "escape";
        key.meta = s.length === 2;
      } else if (s === " " || s === "\x1B ") {
        key.name = "space";
        key.meta = s.length === 2;
      } else if (s <= "") {
        key.name = String.fromCharCode(s.charCodeAt(0) + "a".charCodeAt(0) - 1);
        key.ctrl = true;
      } else if (s.length === 1 && s >= "0" && s <= "9") {
        key.value = Number(s);
        key.name = "number";
      } else if (s.length === 1 && '!"#$%&()*+:<>?@^_{|}~'.indexOf(s) !== -1) {
        key.name = s;
        key.shift = true;
      } else if (".,-\\/;=[]`'".indexOf(s) !== -1) {
        key.name = s;
      } else if (s.length === 1 && s >= "a" && s <= "z") {
        key.name = s;
      } else if (s.length === 1 && s >= "A" && s <= "Z") {
        key.name = s.toLowerCase();
        key.shift = true;
      } else if (parts = metaKeyCodeRe.exec(s)) {
        key.name = parts[1].toLowerCase();
        key.meta = true;
        key.shift = /^[A-Z]$/.test(parts[1]);
      } else if (parts = functionKeyCodeRe.exec(s)) {
        var code = (parts[1] || "") + (parts[2] || "") + (parts[4] || "") + (parts[6] || "");
        var modifier = (parts[3] || parts[5] || 1) - 1;
        key.ctrl = !!(modifier & 4);
        key.meta = !!(modifier & 10);
        key.shift = !!(modifier & 1);
        key.code = code;
        switch (code) {
          case "OP":
            key.name = "f1";
            break;
          case "OQ":
            key.name = "f2";
            break;
          case "OR":
            key.name = "f3";
            break;
          case "OS":
            key.name = "f4";
            break;
          case "[11~":
            key.name = "f1";
            break;
          case "[12~":
            key.name = "f2";
            break;
          case "[13~":
            key.name = "f3";
            break;
          case "[14~":
            key.name = "f4";
            break;
          case "[[A":
            key.name = "f1";
            break;
          case "[[B":
            key.name = "f2";
            break;
          case "[[C":
            key.name = "f3";
            break;
          case "[[D":
            key.name = "f4";
            break;
          case "[[E":
            key.name = "f5";
            break;
          case "[15~":
            key.name = "f5";
            break;
          case "[17~":
            key.name = "f6";
            break;
          case "[18~":
            key.name = "f7";
            break;
          case "[19~":
            key.name = "f8";
            break;
          case "[20~":
            key.name = "f9";
            break;
          case "[21~":
            key.name = "f10";
            break;
          case "[23~":
            key.name = "f11";
            break;
          case "[24~":
            key.name = "f12";
            break;
          case "[A":
            key.name = "up";
            break;
          case "[B":
            key.name = "down";
            break;
          case "[C":
            key.name = "right";
            break;
          case "[D":
            key.name = "left";
            break;
          case "[E":
            key.name = "clear";
            break;
          case "[F":
            key.name = "end";
            break;
          case "[H":
            key.name = "home";
            break;
          case "OA":
            key.name = "up";
            break;
          case "OB":
            key.name = "down";
            break;
          case "OC":
            key.name = "right";
            break;
          case "OD":
            key.name = "left";
            break;
          case "OE":
            key.name = "clear";
            break;
          case "OF":
            key.name = "end";
            break;
          case "OH":
            key.name = "home";
            break;
          case "[1~":
            key.name = "home";
            break;
          case "[2~":
            key.name = "insert";
            break;
          case "[3~":
            key.name = "delete";
            break;
          case "[4~":
            key.name = "end";
            break;
          case "[5~":
            key.name = "pageup";
            break;
          case "[6~":
            key.name = "pagedown";
            break;
          case "[[5~":
            key.name = "pageup";
            break;
          case "[[6~":
            key.name = "pagedown";
            break;
          case "[7~":
            key.name = "home";
            break;
          case "[8~":
            key.name = "end";
            break;
          case "[a":
            key.name = "up";
            key.shift = true;
            break;
          case "[b":
            key.name = "down";
            key.shift = true;
            break;
          case "[c":
            key.name = "right";
            key.shift = true;
            break;
          case "[d":
            key.name = "left";
            key.shift = true;
            break;
          case "[e":
            key.name = "clear";
            key.shift = true;
            break;
          case "[2$":
            key.name = "insert";
            key.shift = true;
            break;
          case "[3$":
            key.name = "delete";
            key.shift = true;
            break;
          case "[5$":
            key.name = "pageup";
            key.shift = true;
            break;
          case "[6$":
            key.name = "pagedown";
            key.shift = true;
            break;
          case "[7$":
            key.name = "home";
            key.shift = true;
            break;
          case "[8$":
            key.name = "end";
            key.shift = true;
            break;
          case "Oa":
            key.name = "up";
            key.ctrl = true;
            break;
          case "Ob":
            key.name = "down";
            key.ctrl = true;
            break;
          case "Oc":
            key.name = "right";
            key.ctrl = true;
            break;
          case "Od":
            key.name = "left";
            key.ctrl = true;
            break;
          case "Oe":
            key.name = "clear";
            key.ctrl = true;
            break;
          case "[2^":
            key.name = "insert";
            key.ctrl = true;
            break;
          case "[3^":
            key.name = "delete";
            key.ctrl = true;
            break;
          case "[5^":
            key.name = "pageup";
            key.ctrl = true;
            break;
          case "[6^":
            key.name = "pagedown";
            key.ctrl = true;
            break;
          case "[7^":
            key.name = "home";
            key.ctrl = true;
            break;
          case "[8^":
            key.name = "end";
            key.ctrl = true;
            break;
          case "[Z":
            key.name = "tab";
            key.shift = true;
            break;
          default:
            key.name = "undefined";
            break;
        }
      } else if (s.length > 1 && s[0] !== "\x1B") {
        for (var i = 0; i < s.length; i++) {
          events = events.concat(utils.normalize(s[i]));
        }
      }
      if (key.code === "[M") {
        key.name = "mouse";
        s = key.sequence;
        var b = s.charCodeAt(3);
        key.x = s.charCodeAt(4) - parseInt("040", 8);
        key.y = s.charCodeAt(5) - parseInt("040", 8);
        key.scroll = 0;
        key.ctrl = !!(1 << 4 & b);
        key.meta = !!(1 << 3 & b);
        key.shift = !!(1 << 2 & b);
        key.release = (3 & b) === 3;
        if (1 << 6 & b) {
          key.scroll = 1 & b ? 1 : -1;
        }
        if (!key.release && !key.scroll) {
          key.button = b & 3;
        }
      }
      if (key.name === "p" && key.ctrl && !key.shift && !key.meta) {
        key.name = "up";
      }
      if (key.name === "n" && key.ctrl && !key.shift && !key.meta) {
        key.name = "down";
      }
      if (!key.name) {
        return events;
      }
      if (s.length === 1) {
        ch = s;
      }
      events.push({ ch, key });
      return events;
    };
    utils.emitKeypress = function(emitter, s, key) {
      var events = utils.normalize(s, key);
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.key && event.key.name === "mouse") {
          emitter.emit("mousepress", event.key);
        } else {
          emitter.emit("keypress", event.key.name, event.key);
          emitter.emit(event.key.name, event.key);
        }
      }
    };
    utils.key = {
      up: "\x1B[A",
      down: "\x1B[B",
      left: "\x1B[D",
      right: "\x1B[C",
      ctrlc: ""
    };
    function last(arr) {
      return arr[arr.length - 1];
    }
    __name(last, "last");
    function isNumber2(n) {
      return isNum(n) && String(n).trim() !== "";
    }
    __name(isNumber2, "isNumber");
    function toNumber(n) {
      return isNumber2(n) ? Number(n) : 1;
    }
    __name(toNumber, "toNumber");
  }
});

// node_modules/.pnpm/readline-ui@2.2.3/node_modules/readline-ui/index.js
var require_readline_ui = __commonJS({
  "node_modules/.pnpm/readline-ui@2.2.3/node_modules/readline-ui/index.js"(exports, module2) {
    "use strict";
    var util = require("util");
    var debug = require_src()("readline-ui");
    var Emitter = require_component_emitter();
    var stringWidth = require_string_width();
    var utils = require_readline_utils();
    var cached;
    function UI2(options) {
      if (!(this instanceof UI2)) {
        var ui = Object.create(UI2.prototype);
        UI2.apply(ui, arguments);
        return ui;
      }
      debug("initializing from <%s>", __filename);
      this.options = utils.createOptions(options);
      this.appendedLines = 0;
      this.height = 0;
      this.initInterface();
    }
    __name(UI2, "UI");
    Emitter(UI2.prototype);
    UI2.prototype.initInterface = function() {
      if (this.initialized)
        return;
      this.initialized = true;
      var self2 = this;
      if (typeof this.rl === "undefined") {
        this.rl = utils.createInterface(this.options);
      }
      this.forceClose = this.forceClose.bind(this);
      this.onKeypress = this.onKeypress.bind(this);
      this.rl.input.on("keypress", self2.onKeypress);
      this.resume();
      this.rl.on("line", function(line) {
        setImmediate(function() {
          self2.emit("line", line, { name: "line", value: line });
        });
      });
      this.rl.on("SIGINT", this.forceClose);
      process.on("exit", this.forceClose);
    };
    UI2.prototype.onKeypress = function(input, key) {
      utils.emitKeypress(this, input, key);
    };
    UI2.prototype.render = function(input, footer) {
      this.rl.output.unmute();
      this.clearLines(this.appendedLines);
      var line = utils.lastLine(input);
      var rawLine = utils.unstyle(line);
      var prompt = line;
      if (this.rl.line.length) {
        prompt = prompt.slice(0, -this.rl.line.length);
      }
      this.rl.setPrompt(prompt);
      var cursorPos = this.cacheCursorPos();
      var width = utils.cliWidth(this.rl);
      input = utils.forceLineReturn(input, width);
      if (footer) {
        footer = utils.forceLineReturn(footer, width);
      }
      if (rawLine.length % width === 0) {
        input += "\n";
      }
      var fullContent = input + (footer ? "\n" + String(footer) : "");
      this.rl.output.write(fullContent);
      var promptLineUpDiff = Math.floor(rawLine.length / width) - cursorPos.rows;
      var footerHeight = promptLineUpDiff + (footer ? utils.height(footer) : 0);
      if (footerHeight > 0) {
        utils.up(this.rl, footerHeight);
      }
      var lastLine = utils.lastLine(fullContent);
      utils.left(this.rl, stringWidth(lastLine));
      var newPos = utils.unstyle(input).length;
      utils.right(this.rl, newPos);
      this.appendedLines = footerHeight;
      this.height = utils.height(fullContent);
      this.rl.output.mute();
    };
    UI2.prototype.clearLines = function(n) {
      if (n)
        utils.down(this.rl, n);
      utils.clearLine(this.rl, this.height);
    };
    UI2.prototype.cacheCursorPos = function() {
      this.cursorPos = utils.cursorPosition(this.rl);
      return this.cursorPos;
    };
    UI2.prototype.restoreCursorPos = function() {
      utils.restoreCursorPos(this.rl, this.cursorPos);
      return this;
    };
    UI2.prototype.resume = function() {
      this.rl.resume();
    };
    UI2.prototype.pause = function() {
      this.rl.pause();
      this.emit("pause");
    };
    UI2.prototype.close = function() {
      utils.close(this.rl);
      this.emit("close");
    };
    UI2.prototype.forceClose = function() {
      utils.forceClose(this.rl);
    };
    UI2.prototype.finish = function() {
      var ui = this;
      return function(val) {
        ui.close();
        ui.emit("finish");
        return val;
      };
    };
    UI2.prototype.end = function(newline) {
      this.rl.setPrompt("");
      this.rl.output.unmute();
      this.rl.output.write(newline !== false ? "\n" : "");
      utils.cursorShow(this.rl);
    };
    UI2.prototype.mute = function() {
      var rl = this.rl;
      var unmute = rl.output.unmute;
      rl.output.unmute = function() {
      };
      rl.output.mute();
      return function() {
        rl.output.unmute = unmute;
        unmute();
      };
    };
    UI2.prototype.log = function(input) {
      this.rl.output.unmute();
      this.rl.output.write(util.inspect.apply(util, arguments));
      this.rl.output.mute();
    };
    module2.exports = UI2;
    module2.exports.create = function(options) {
      if (cached)
        return cached;
      cached = new UI2(options);
      return cached;
    };
  }
});

// node_modules/.pnpm/color-name@1.1.4/node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/.pnpm/color-name@1.1.4/node_modules/color-name/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/conversions.js"(exports, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = /* @__PURE__ */ __name(function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      }, "diffc");
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    __name(comparativeDistance, "comparativeDistance");
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/route.js"(exports, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    __name(buildGraph, "buildGraph");
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    __name(deriveBFS, "deriveBFS");
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    __name(link, "link");
    function wrapConversion(toModel, graph) {
      const path = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    __name(wrapConversion, "wrapConversion");
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/index.js"(exports, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = /* @__PURE__ */ __name(function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      }, "wrappedFn");
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    __name(wrapRaw, "wrapRaw");
    function wrapRounded(fn) {
      const wrappedFn = /* @__PURE__ */ __name(function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      }, "wrappedFn");
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    __name(wrapRounded, "wrapRounded");
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/.pnpm/ansi-styles@4.3.0/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/.pnpm/ansi-styles@4.3.0/node_modules/ansi-styles/index.js"(exports, module2) {
    "use strict";
    var wrapAnsi16 = /* @__PURE__ */ __name((fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    }, "wrapAnsi16");
    var wrapAnsi256 = /* @__PURE__ */ __name((fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    }, "wrapAnsi256");
    var wrapAnsi16m = /* @__PURE__ */ __name((fn, offset) => (...args) => {
      const rgb = fn(...args);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    }, "wrapAnsi16m");
    var ansi2ansi = /* @__PURE__ */ __name((n) => n, "ansi2ansi");
    var rgb2rgb = /* @__PURE__ */ __name((r, g, b) => [r, g, b], "rgb2rgb");
    var setLazyProperty = /* @__PURE__ */ __name((object, property, get2) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get2();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    }, "setLazyProperty");
    var colorConvert;
    var makeDynamicStyles = /* @__PURE__ */ __name((wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name2 = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name2] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles[name2] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    }, "makeDynamicStyles");
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    __name(assembleStyles, "assembleStyles");
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    __name(translateLevel, "translateLevel");
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version2 = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version2 >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    __name(supportsColor, "supportsColor");
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    __name(getSupportLevel, "getSupportLevel");
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/util.js"(exports, module2) {
    "use strict";
    var stringReplaceAll = /* @__PURE__ */ __name((string, substring, replacer) => {
      let index = string.indexOf(substring);
      if (index === -1) {
        return string;
      }
      const substringLength = substring.length;
      let endIndex = 0;
      let returnValue = "";
      do {
        returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
        endIndex = index + substringLength;
        index = string.indexOf(substring, endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    }, "stringReplaceAll");
    var stringEncaseCRLFWithFirstIndex = /* @__PURE__ */ __name((string, prefix, postfix, index) => {
      let endIndex = 0;
      let returnValue = "";
      do {
        const gotCR = string[index - 1] === "\r";
        returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
        endIndex = index + 1;
        index = string.indexOf("\n", endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    }, "stringEncaseCRLFWithFirstIndex");
    module2.exports = {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    };
  }
});

// node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/templates.js
var require_templates = __commonJS({
  "node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/templates.js"(exports, module2) {
    "use strict";
    var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      ["n", "\n"],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);
    function unescape(c) {
      const u = c[0] === "u";
      const bracket = c[1] === "{";
      if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      if (u && bracket) {
        return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    __name(unescape, "unescape");
    function parseArguments(name2, arguments_) {
      const results = [];
      const chunks = arguments_.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        const number = Number(chunk);
        if (!Number.isNaN(number)) {
          results.push(number);
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name2}')`);
        }
      }
      return results;
    }
    __name(parseArguments, "parseArguments");
    function parseStyle(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name2 = matches[1];
        if (matches[2]) {
          const args = parseArguments(name2, matches[2]);
          results.push([name2].concat(args));
        } else {
          results.push([name2]);
        }
      }
      return results;
    }
    __name(parseStyle, "parseStyle");
    function buildStyle(chalk2, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk2;
      for (const [styleName, styles2] of Object.entries(enabled)) {
        if (!Array.isArray(styles2)) {
          continue;
        }
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`);
        }
        current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
      }
      return current;
    }
    __name(buildStyle, "buildStyle");
    module2.exports = (chalk2, temporary) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
        if (escapeCharacter) {
          chunk.push(unescape(escapeCharacter));
        } else if (style) {
          const string = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? string : buildStyle(chalk2, styles)(string));
          styles.push({ inverse, styles: parseStyle(style) });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk2, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(character);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMessage);
      }
      return chunks.join("");
    };
  }
});

// node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/index.js
var require_source = __commonJS({
  "node_modules/.pnpm/chalk@4.1.2/node_modules/chalk/source/index.js"(exports, module2) {
    "use strict";
    var ansiStyles = require_ansi_styles();
    var { stdout: stdoutColor, stderr: stderrColor } = require_supports_color();
    var {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    } = require_util();
    var { isArray } = Array;
    var levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    var styles = /* @__PURE__ */ Object.create(null);
    var applyOptions = /* @__PURE__ */ __name((object, options = {}) => {
      if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error("The `level` option should be an integer from 0 to 3");
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object.level = options.level === void 0 ? colorLevel : options.level;
    }, "applyOptions");
    var ChalkClass = class {
      constructor(options) {
        return chalkFactory(options);
      }
    };
    __name(ChalkClass, "ChalkClass");
    var chalkFactory = /* @__PURE__ */ __name((options) => {
      const chalk3 = {};
      applyOptions(chalk3, options);
      chalk3.template = (...arguments_) => chalkTag(chalk3.template, ...arguments_);
      Object.setPrototypeOf(chalk3, Chalk.prototype);
      Object.setPrototypeOf(chalk3.template, chalk3);
      chalk3.template.constructor = () => {
        throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
      };
      chalk3.template.Instance = ChalkClass;
      return chalk3.template;
    }, "chalkFactory");
    function Chalk(options) {
      return chalkFactory(options);
    }
    __name(Chalk, "Chalk");
    for (const [styleName, style] of Object.entries(ansiStyles)) {
      styles[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles.visible = {
      get() {
        const builder = createBuilder(this, this._styler, true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (const model of usedModels) {
      styles[model] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    for (const model of usedModels) {
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles[bgModel] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, {
      ...styles,
      level: {
        enumerable: true,
        get() {
          return this._generator.level;
        },
        set(level) {
          this._generator.level = level;
        }
      }
    });
    var createStyler = /* @__PURE__ */ __name((open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    }, "createStyler");
    var createBuilder = /* @__PURE__ */ __name((self2, _styler, _isEmpty) => {
      const builder = /* @__PURE__ */ __name((...arguments_) => {
        if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
          return applyStyle(builder, chalkTag(builder, ...arguments_));
        }
        return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
      }, "builder");
      Object.setPrototypeOf(builder, proto);
      builder._generator = self2;
      builder._styler = _styler;
      builder._isEmpty = _isEmpty;
      return builder;
    }, "createBuilder");
    var applyStyle = /* @__PURE__ */ __name((self2, string) => {
      if (self2.level <= 0 || !string) {
        return self2._isEmpty ? "" : string;
      }
      let styler = self2._styler;
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.indexOf("\x1B") !== -1) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    }, "applyStyle");
    var template;
    var chalkTag = /* @__PURE__ */ __name((chalk3, ...strings) => {
      const [firstString] = strings;
      if (!isArray(firstString) || !isArray(firstString.raw)) {
        return strings.join(" ");
      }
      const arguments_ = strings.slice(1);
      const parts = [firstString.raw[0]];
      for (let i = 1; i < firstString.length; i++) {
        parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"), String(firstString.raw[i]));
      }
      if (template === void 0) {
        template = require_templates();
      }
      return template(chalk3, parts.join(""));
    }, "chalkTag");
    Object.defineProperties(Chalk.prototype, styles);
    var chalk2 = Chalk();
    chalk2.supportsColor = stdoutColor;
    chalk2.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
    chalk2.stderr.supportsColor = stderrColor;
    module2.exports = chalk2;
  }
});

// package.json
var name = "stoa";
var description = "language framework";
var version = "2022.07.20";
var repository = "https://github.com/khtdr/stoa";
var author = "Kay Oh <khtdr.com@gmail.com>";
var license = "UNLICENSED";

// src/lib/cli.ts
var opts = __toESM(require_opts());
var import_fs = require("fs");
var import_path = require("path");
var CliDriver = class {
  constructor(lang, treewalkers = {}) {
    this.lang = lang;
    this.treewalkers = treewalkers;
  }
  run() {
    const [driver, { runFile, runPipe, runRepl, tokenize }] = this.configure();
    if (runFile)
      driver.run((0, import_fs.readFileSync)((0, import_path.resolve)(runFile)).toString());
    if (runPipe)
      driver.run((0, import_fs.readFileSync)("/dev/stdin").toString());
    if (runRepl) {
      new Repl(driver).run(tokenize).then(() => {
        process.exit(driver.status);
      });
    } else {
      process.exit(driver.status);
    }
  }
  configure() {
    if (!this._configuration) {
      opts.parse([
        {
          description: "Displays the version and exits",
          short: "v",
          long: "version"
        },
        {
          description: "Emits the list of tokens (JSON)",
          short: "t",
          long: "tokenize"
        },
        {
          description: "Emits the parse tree (CST/JSON)",
          short: "p",
          long: "parse"
        },
        { description: "Launches a colorful REPL", short: "r", long: "repl" }
      ], [{ name: "file" }], true);
      this._configuration = [
        new Driver(this.lang, opts.get("parse") ? new this.treewalkers.Printer() : new this.treewalkers.Evaluator()),
        { tokenize: !!opts.get("tokenize"), runFile: false, runPipe: false, runRepl: false }
      ];
      const file = opts.arg("file");
      if (file)
        this._configuration[1].runFile = file;
      if (opts.get("repl"))
        this._configuration[1].runRepl = true;
      else if (!file)
        this._configuration[1].runPipe = true;
      if (opts.get("version")) {
        const { name: name2, version: version2, ...details } = this.lang.details;
        console.log(`${name2}-${version2}`, details);
        process.exit(0);
      }
    }
    return this._configuration;
  }
};
__name(CliDriver, "CliDriver");

// src/lib/driver.ts
var Driver = class {
  constructor(lang, treewalker) {
    this.lang = lang;
    this.treewalker = treewalker;
    this.status = 0;
  }
  run(source) {
    try {
      const tokens = this.lang.scan(source);
      if (!tokens)
        throw new Error("failed to tokenize");
      const ast = this.lang.parse(tokens);
      if (!ast)
        throw new Error("failed to parse");
      const result = this.treewalker.visit(ast);
      return { tokens, result };
    } catch (e) {
      console.warn(e);
    } finally {
      return { tokens: [], result: void 0 };
    }
  }
};
__name(Driver, "Driver");

// src/lib/language.ts
var Language2 = class {
  constructor(details = {}, frontend = {}) {
    this.details = {
      ...details,
      name: details.name ?? "nameless-lang",
      version: details.version ?? "0.0.experimental"
    };
    this.frontend = {
      Scanner: frontend.Scanner || TokenStreamClassFactory.buildTokenStreamClass({ CHAR: /./ }),
      Parser: frontend.Parser || AnyTokenParser
    };
  }
  scan(source) {
    return new this.frontend.Scanner(source).drain();
  }
  parse(tokens) {
    return new this.frontend.Parser(tokens).parse();
  }
};
__name(Language2, "Language");

// src/lib/tokenizer.ts
var ERROR_TOKEN = "__stoa__::error";
var Token = class {
  constructor(name2, text, value, pos) {
    this.name = name2;
    this.text = text;
    this.value = value;
    this.pos = pos;
  }
  toString() {
    const pos = `[${this.pos.line},${this.pos.column}]`;
    const value = this.text === this.value ? "" : `(${this.value})`;
    return `${this.name}${value}${pos}`;
  }
};
__name(Token, "Token");
var TokenStream = class {
  constructor(source, lexicon = {}, reporter = new StdReporter()) {
    this.reporter = reporter;
    this.buffer = [];
    this.eof = false;
    this.error = false;
    this.generator = tokenGenerator(source, lexicon);
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
  next() {
    if (this.eof)
      return;
    while (true) {
      const token = this.generator.next().value;
      if (!token) {
        this.eof = true;
        break;
      }
      if (token.name.toString().startsWith("_"))
        continue;
      if (token.name == ERROR_TOKEN) {
        this.err(token);
        continue;
      }
      return token;
    }
  }
  err(token) {
    this.error = true;
    const { text, pos: { line, column } } = token;
    this.reporter.error(token, `Syntax error near ${text} at ${line}:${column}`);
  }
};
__name(TokenStream, "TokenStream");
var TokenStreamClassFactory = class {
  static buildTokenStreamClass(lexicon) {
    const TOKENS = Object.keys(lexicon).reduce((a, c) => (a[c] = c, a), {});
    class TokenStreamClassFactoryClass extends TokenStream {
      constructor(source) {
        super(source, lexicon);
      }
    }
    __name(TokenStreamClassFactoryClass, "TokenStreamClassFactoryClass");
    TokenStreamClassFactoryClass.TOKENS = TOKENS;
    return TokenStreamClassFactoryClass;
  }
};
__name(TokenStreamClassFactory, "TokenStreamClassFactory");
function* tokenGenerator(source, lexicon) {
  let idx = 0, line = 1, column = 1;
  while (idx < source.length) {
    const [name2 = ERROR_TOKEN, text = source[idx], value] = longest(possible());
    const token = new Token(name2, text, value, pos());
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
    Object.entries(lexicon).map(([name2, rule]) => {
      const [lexeme, valueFn = /* @__PURE__ */ __name((val) => val, "valueFn")] = Array.isArray(rule) ? rule : [rule];
      if (typeof lexeme == "function") {
        const text = lexeme(source.substring(idx));
        if (text)
          candidates.push([name2, text, valueFn(text)]);
      } else if (typeof lexeme != "string") {
        const regex = new RegExp(`^${lexeme.source}`, lexeme.flags);
        const match = regex.exec(source.substring(idx));
        if (match)
          return candidates.push([name2, match[0], valueFn(match[0])]);
      } else if (source.substring(idx, idx + lexeme.length) == lexeme) {
        return candidates.push([name2, lexeme, valueFn(lexeme)]);
      }
    });
    return candidates;
  }
  __name(possible, "possible");
}
__name(tokenGenerator, "tokenGenerator");

// src/lib/parser.ts
var Parser = class {
  constructor(tokens, reporter = new StdReporter()) {
    this.tokens = tokens;
    this.reporter = reporter;
    this.current = 0;
  }
  parse() {
    return void 0;
  }
  match(...names) {
    for (const name2 of names) {
      if (this.check(name2)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  consume(name2, message) {
    if (this.check(name2))
      return this.advance();
    else
      throw `Error: ${this.peek()} ${message}`;
  }
  check(name2) {
    var _a;
    return ((_a = this.peek()) == null ? void 0 : _a.name) == name2;
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
  peek() {
    return this.tokens[this.current];
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
  visit(node) {
    const name2 = node.constructor.name;
    const fn = this[name2];
    if (typeof fn == "function")
      return fn.bind(this)(node);
    throw new ParseError(`Unvisitable node: ${name2}`);
  }
};
__name(Visitor, "Visitor");
var ParseError = class extends Error {
};
__name(ParseError, "ParseError");
var AnyTokenParser = class extends Parser {
  parse() {
    const tokens = [];
    while (!this.atEnd())
      tokens.push(this.advance());
    return tokens;
  }
};
__name(AnyTokenParser, "AnyTokenParser");

// src/lib/repl.ts
var import_readline_ui = __toESM(require_readline_ui());
var import_chalk = __toESM(require_source());
var Repl = class {
  constructor(driver) {
    this.driver = driver;
  }
  async run(tokenize = false) {
    return new Promise((resolve2) => {
      const ui = new import_readline_ui.default();
      const prompt = import_chalk.default`{blue ?>} `;
      ui.render(prompt);
      ui.on("keypress", () => ui.render(prompt + ui.rl.line));
      ui.on("line", (line) => {
        ui.render(prompt + line);
        ui.end();
        ui.rl.pause();
        if (line == ".quit.")
          return resolve2(void 0);
        const out = this.driver.run(line);
        const value = tokenize ? out.tokens.join("\n") : out.result;
        console.log(import_chalk.default`{gray >>} ${value}`);
        ui.rl.resume();
        ui.render(prompt);
      });
    });
  }
};
__name(Repl, "Repl");

// src/lib/reporter.ts
var StdReporter = class {
  error(token, message) {
    const str = message ?? token.toString();
    console.error(str);
  }
};
__name(StdReporter, "StdReporter");

// src/scanner.ts
var Scanner = TokenStreamClassFactory.buildTokenStreamClass({
  FALSE: [/false/i, () => false],
  NIL: [/nil/i, () => void 0],
  NUMBER: [/\d+(\.\d+)?/, (text) => parseFloat(text)],
  STRING: [stringScanner, (text) => {
    if (['"', "'"].includes(text.substring(text.length - 1)))
      return text.replace(/^.(.*).$/, "$1");
    return text.replace(/^.(.*)$/, "$1");
  }],
  TRUE: [/true/i, () => true],
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
  IDENTIFIER: /[a-z][a-z\d]*/i,
  _MULTI_LINE_COMMENT: cStyleCommentScanner,
  _SINGLE_LINE_COMMENT: [/\/\/.*/, (text) => text.substring(2).trim()],
  _SHEBANG_COMMENT: /\#\!\/usr\/bin\/env\s.*/,
  _SPACE: /\s+/
});
var TOKEN = Scanner.TOKENS;
function stringScanner(value, reporter = new StdReporter()) {
  const tokenizer = new TokenStream(value, {
    SINGLE: "'",
    DOUBLE: '"',
    ESCAPED_CHAR: /\\./,
    CHAR: /.|\s/
  });
  const opener = tokenizer.take();
  if (opener && ["SINGLE", "DOUBLE"].includes(opener.name)) {
    let { text } = opener, closer;
    while (closer = tokenizer.take()) {
      text += closer.text;
      if (closer.name == opener.name)
        return text;
    }
    reporter.error(opener, `Expected to find a closing ${opener.text} for the string at ${opener.pos.line}:${opener.pos.column}`);
    return text;
  }
}
__name(stringScanner, "stringScanner");
function cStyleCommentScanner(value, reporter = new StdReporter()) {
  const tokenizer = new TokenStream(value, {
    OPEN: "/*",
    CLOSE: "*/",
    ESCAPED_CHAR: /\\./,
    CHAR: /.|\s/
  });
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
    reporter.error(opener, `Expected to find a closing ${opener.text} for the comment at ${opener.pos.line}:${opener.pos.column}`);
    return text;
  }
}
__name(cStyleCommentScanner, "cStyleCommentScanner");

// src/ast.ts
var Visitor2 = class extends Visitor {
};
__name(Visitor2, "Visitor");
var Program = class {
  constructor(declarations) {
    this.declarations = declarations;
  }
};
__name(Program, "Program");
var VarDeclaration = class {
  constructor(ident, expr) {
    this.ident = ident;
    this.expr = expr;
  }
};
__name(VarDeclaration, "VarDeclaration");
var FunctionDeclaration = class {
  constructor(ident, fun) {
    this.ident = ident;
    this.fun = fun;
  }
};
__name(FunctionDeclaration, "FunctionDeclaration");
var Function2 = class {
  constructor(params, block) {
    this.params = params;
    this.block = block;
  }
};
__name(Function2, "Function");
var IfStatement = class {
  constructor(condition, trueStatement, falseStatement) {
    this.condition = condition;
    this.trueStatement = trueStatement;
    this.falseStatement = falseStatement;
  }
};
__name(IfStatement, "IfStatement");
var ReturnStatement = class {
  constructor(expr) {
    this.expr = expr;
  }
};
__name(ReturnStatement, "ReturnStatement");
var JumpStatement = class {
  constructor(destination, distance) {
    this.destination = destination;
    this.distance = distance;
  }
};
__name(JumpStatement, "JumpStatement");
var WhileStatement = class {
  constructor(condition, body) {
    this.condition = condition;
    this.body = body;
  }
};
__name(WhileStatement, "WhileStatement");
var ExpressionStatement = class {
  constructor(expr) {
    this.expr = expr;
  }
};
__name(ExpressionStatement, "ExpressionStatement");
var PrintStatement = class {
  constructor(expr) {
    this.expr = expr;
  }
};
__name(PrintStatement, "PrintStatement");
var Block = class {
  constructor(statements) {
    this.statements = statements;
  }
};
__name(Block, "Block");
var Literal = class {
  constructor(value) {
    this.value = value;
  }
};
__name(Literal, "Literal");
var Variable = class {
  constructor(name2) {
    this.name = name2;
  }
};
__name(Variable, "Variable");
var Unary = class {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }
};
__name(Unary, "Unary");
var Call = class {
  constructor(callee, args, end) {
    this.callee = callee;
    this.args = args;
    this.end = end;
  }
};
__name(Call, "Call");
var Binary = class {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
};
__name(Binary, "Binary");
var Assign = class {
  constructor(name2, expr) {
    this.name = name2;
    this.expr = expr;
  }
};
__name(Assign, "Assign");
var Logical = class extends Binary {
};
__name(Logical, "Logical");
var Ternary = class {
  constructor(left, op1, middle, op2, right) {
    this.left = left;
    this.op1 = op1;
    this.middle = middle;
    this.op2 = op2;
    this.right = right;
  }
};
__name(Ternary, "Ternary");
var Grouping = class {
  constructor(inner) {
    this.inner = inner;
  }
};
__name(Grouping, "Grouping");

// src/parser.ts
var Parser2 = class extends Parser {
  parse() {
    if (!this._parsed)
      this._parsed = this.Program();
    return this._parsed;
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
    if (this.match(TOKEN.FUN)) {
      const ident = this.consume("IDENTIFIER", "Expected identifier");
      const fun = this.Function();
      return new FunctionDeclaration(ident, fun);
    }
  }
  Function() {
    this.consume(TOKEN.LEFT_PAREN, "Expected (");
    const parameters = this.Parameters();
    this.consume(TOKEN.RIGHT_PAREN, "Expected )");
    const block = this.Block();
    if (!block)
      throw this.error(this.peek(), "Expected {");
    return new Function2(parameters, block);
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
      return new VarDeclaration(ident, expr);
    }
  }
  Statement() {
    return this.PrintStatement() || this.ReturnStatement() || this.IfStatement() || this.WhileStatement() || this.ForStatement() || this.JumpStatement() || this.Block() || this.ExpressionStatement();
  }
  ReturnStatement() {
    if (this.match(TOKEN.RETURN)) {
      let expr = new Literal(void 0);
      if (!this.match(TOKEN.SEMICOLON)) {
        expr = this.Expression();
        this.consume(TOKEN.SEMICOLON, "Expected ;");
      }
      return new ReturnStatement(expr);
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
      const block = new Block(declarations);
      this.consume(TOKEN.RIGHT_CURL, "Expected }");
      return block;
    }
  }
  JumpStatement() {
    var _a;
    if (this.match(TOKEN.BREAK, TOKEN.CONTINUE)) {
      const jump = this.previous();
      let expr = new Literal(1);
      if (((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.SEMICOLON)
        expr = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      return new JumpStatement(jump, expr);
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
        return new IfStatement(cond, trueStatement, falseStatement);
      } else {
        return new IfStatement(cond, trueStatement);
      }
    }
  }
  WhileStatement() {
    if (this.match(TOKEN.WHILE)) {
      this.consume(TOKEN.LEFT_PAREN, "Expected (");
      const cond = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, "Expected )");
      const body = this.Statement();
      return new WhileStatement(cond, body);
    }
  }
  ForStatement() {
    var _a, _b;
    if (this.match(TOKEN.FOR)) {
      this.consume(TOKEN.LEFT_PAREN, "Expected (");
      const init = this.VarDeclaration() || this.ExpressionStatement() || this.consume(TOKEN.SEMICOLON, "Expected ;") && new Literal(true);
      let cond = new Literal(true);
      if (((_a = this.peek()) == null ? void 0 : _a.name) != TOKEN.SEMICOLON)
        cond = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      let incr = new Literal(true);
      if (((_b = this.peek()) == null ? void 0 : _b.name) != TOKEN.RIGHT_PAREN)
        incr = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, "Expected )");
      const body_statement = this.Statement();
      return new Block([
        init,
        new WhileStatement(cond, new Block([
          body_statement,
          new ExpressionStatement(incr)
        ]))
      ]);
    }
  }
  PrintStatement() {
    if (this.match(TOKEN.PRINT)) {
      const expr = this.Expression();
      this.consume(TOKEN.SEMICOLON, "Expected ;");
      return new PrintStatement(expr);
    }
  }
  ExpressionStatement() {
    const expr = this.Expression();
    this.consume(TOKEN.SEMICOLON, "Expected ;");
    return new ExpressionStatement(expr);
  }
  Expression() {
    return this.Comma();
  }
  Comma() {
    let expr = this.Assignment();
    while (this.match(TOKEN.COMMA)) {
      const comma = this.previous();
      const right = this.Assignment();
      expr = new Binary(expr, comma, right);
    }
    return expr;
  }
  Assignment() {
    const expr = this.LogicOr();
    if (this.match(TOKEN.EQUAL)) {
      const eq = this.previous();
      const value = this.Assignment();
      if (expr instanceof Variable) {
        return new Assign(expr.name, value);
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
      expr = new Logical(expr, or, right);
    }
    return expr;
  }
  LogicAnd() {
    let expr = this.Conditional();
    while (this.match(TOKEN.AND)) {
      const and = this.previous();
      const right = this.Conditional();
      expr = new Logical(expr, and, right);
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
      expr = new Ternary(expr, question, middle, colon, right);
    }
    return expr;
  }
  Equality() {
    let expr = this.Comparison();
    while (this.match(TOKEN.BANG_EQUAL, TOKEN.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.Comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Comparison() {
    let expr = this.Term();
    while (this.match(TOKEN.LESS, TOKEN.GREATER, TOKEN.LESS_EQUAL, TOKEN.GREATER_EQUAL)) {
      const operator = this.previous();
      const right = this.Term();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Term() {
    let expr = this.Factor();
    while (this.match(TOKEN.PLUS, TOKEN.DASH)) {
      const operator = this.previous();
      const right = this.Factor();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }
  Factor() {
    let expr = this.Unary();
    while (this.match(TOKEN.STAR, TOKEN.SLASH)) {
      const operator = this.previous();
      const right = this.Unary();
      expr = new Binary(expr, operator, right);
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
      return new Unary(operator, right);
    }
    return this.Call();
  }
  Call() {
    const expr = this.Primary();
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
      return new Call(expr, args, paren);
    }
    return expr;
  }
  Primary() {
    if (this.match(TOKEN.NUMBER, TOKEN.STRING, TOKEN.TRUE, TOKEN.FALSE, TOKEN.NIL)) {
      return new Literal(this.previous().value);
    }
    if (this.match(TOKEN.IDENTIFIER)) {
      return new Variable(this.previous());
    }
    if (this.match(TOKEN.LEFT_PAREN)) {
      const expr = this.Expression();
      this.consume(TOKEN.RIGHT_PAREN, 'Expected ")" after expression');
      return new Grouping(expr);
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

// src/runtime.ts
var Environment = class {
  constructor(enclosure) {
    this.enclosure = enclosure;
    this.table = /* @__PURE__ */ new Map();
  }
  has(name2) {
    var _a;
    return this.table.has(name2) || !!((_a = this.enclosure) == null ? void 0 : _a.has(name2));
  }
  init(name2) {
    if (!this.table.has(name2))
      this.table.set(name2, void 0);
    else
      throw new RuntimeError(`Variable already defined: ${name2}`);
  }
  set(name2, value) {
    var _a;
    if (this.table.has(name2))
      this.table.set(name2, value);
    else if ((_a = this.enclosure) == null ? void 0 : _a.has(name2))
      this.enclosure.set(name2, value);
    else
      throw new RuntimeError(`No such variable: ${name2}`);
  }
  get(name2) {
    var _a;
    if (this.table.has(name2))
      return this.table.get(name2);
    if ((_a = this.enclosure) == null ? void 0 : _a.has(name2))
      return this.enclosure.get(name2);
    throw new RuntimeError(`Undefined variable: ${name2}`);
  }
};
__name(Environment, "Environment");
function isNumber(val) {
  return typeof val == "number";
}
__name(isNumber, "isNumber");
function isString(val) {
  return typeof val == "string";
}
__name(isString, "isString");
function lit(val) {
  if (val === void 0)
    return "nil";
  return `${val}`;
}
__name(lit, "lit");
function truthy(val) {
  if (val === false)
    return false;
  if (val === void 0)
    return false;
  return true;
}
__name(truthy, "truthy");
var Function3 = class {
  constructor(arity, call) {
    this.arity = arity;
    this.call = call;
  }
};
__name(Function3, "Function");
var RuntimeError = class extends Error {
};
__name(RuntimeError, "RuntimeError");
var ReturnException = class extends Error {
  constructor() {
    super(...arguments);
    this.value = void 0;
  }
};
__name(ReturnException, "ReturnException");
var JumpException = class extends Error {
  constructor() {
    super(...arguments);
    this.distance = 1;
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

// src/printer.ts
var Printer = class extends Visitor2 {
  Program(program) {
    const decls = program.declarations.map((decl) => this.visit(decl)).join("\n");
    return `(program 
${indent(decls)}
)`;
  }
  ReturnStatement(ret) {
    return `(return ${this.visit(ret.expr)})`;
  }
  FunctionDeclaration(decl) {
    const name2 = decl.ident.text;
    const val = this.visit(decl.fun);
    return `(fun ${name2} ${val})`;
  }
  Function(fun) {
    const params = fun.params.map((p) => p.text).join(" ");
    const body = this.visit(fun.block);
    return `(let [${params}] ${body})`;
  }
  Logical(expr) {
    return this.Binary(expr);
  }
  VarDeclaration(declaration) {
    const decl = `(var ${declaration.ident.text}`;
    const init = declaration.expr ? ` ${this.visit(declaration.expr)}` : "";
    return `${decl}${init})`;
  }
  Call(call) {
    const callee = `(${this.visit(call.callee)}`;
    if (!call.args.length)
      return `${callee})`;
    const args = call.args.map((arg2) => this.visit(arg2)).join(" ");
    return `${callee} ${args})`;
  }
  PrintStatement(statement) {
    return `(print ${this.visit(statement.expr)})`;
  }
  Variable(expr) {
    return `${expr.name.text}`;
  }
  ExpressionStatement(statement) {
    return this.visit(statement.expr);
  }
  WhileStatement(statement) {
    const cond = this.visit(statement.condition);
    const body = this.visit(statement.body);
    return `(while ${cond} 
${indent(body)}
)`;
  }
  JumpStatement(statement) {
    const dest = statement.destination.name;
    const dist = this.visit(statement.distance || new Literal(1));
    return `(${dest} ${dist})`;
  }
  Assign(assign) {
    return `(= ${assign.name.text} ${lit(this.visit(assign.expr))})`;
  }
  Literal(expr) {
    return lit(expr.value);
  }
  Unary(expr) {
    const operator = expr.operator.text;
    const operand = this.visit(expr.operand);
    return `(${operator} ${operand})`;
  }
  Block(block) {
    const blocks = block.statements.map((stmt) => this.visit(stmt)).join("\n");
    return `(block 
${indent(blocks)}
)`;
  }
  Binary(expr) {
    const operator = expr.operator.text;
    const left = this.visit(expr.left);
    const right = this.visit(expr.right);
    return `(${operator} ${left} ${right})`;
  }
  Ternary(expr) {
    const left = this.visit(expr.left);
    const middle = this.visit(expr.middle);
    const right = this.visit(expr.right);
    return `(?: ${left} ${middle} ${right})`;
  }
  Grouping(expr) {
    const operand = this.visit(expr.inner);
    return `(group ${operand})`;
  }
  IfStatement(statement) {
    const cond = this.visit(statement.condition);
    const stmtTrue = this.visit(statement.trueStatement);
    if (!statement.falseStatement)
      return `(if ${cond} ${stmtTrue})`;
    const stmtFalse = this.visit(statement.falseStatement);
    return `(if ${cond} 
${indent(stmtTrue)} 
${indent(stmtFalse)})`;
  }
};
__name(Printer, "Printer");
function indent(text) {
  const pad = new Array(3).fill(" ").join("");
  return text.replace(/^/mg, pad);
}
__name(indent, "indent");

// src/evaluator.ts
var Evaluator = class extends Visitor2 {
  constructor() {
    super();
    this.globals = new Environment();
    this.env = this.globals;
    this.globals.init("clock");
    this.globals.set("clock", {
      arity: 0,
      call() {
        return new Date().toLocaleString();
      }
    });
  }
  Program(program) {
    const statements = program.declarations.map((stmt) => this.visit(stmt));
    if (!statements.length)
      return lit(void 0);
    return lit(statements[statements.length - 1]);
  }
  FunctionDeclaration(decl) {
    const func = this.Function(decl.fun);
    this.env.init(decl.ident.text);
    this.env.set(decl.ident.text, func);
  }
  Function(fun) {
    const closure = new Environment(this.env);
    return new Function3(fun.params.length, (args) => {
      const previous = this.env;
      this.env = new Environment(closure);
      try {
        args.map((arg2, i) => {
          const param = fun.params[i].text;
          this.env.init(param);
          this.env.set(param, arg2);
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
  PrintStatement(statement) {
    console.log(lit(this.visit(statement.expr)));
  }
  VarDeclaration(declaration) {
    this.env.init(declaration.ident.text);
    const val = declaration.expr ? this.visit(declaration.expr) : void 0;
    this.env.set(declaration.ident.text, val);
  }
  ExpressionStatement(statement) {
    this.visit(statement.expr);
  }
  Call(call) {
    const callee = this.visit(call.callee);
    if (!isCallable(callee))
      throw new RuntimeError("uncallable target");
    if (callee.arity != call.args.length)
      throw new RuntimeError("wrong number of args");
    return callee.call(call.args.map((arg2) => this.visit(arg2)));
  }
  IfStatement(statement) {
    const condition = this.visit(statement.condition);
    if (truthy(condition))
      this.visit(statement.trueStatement);
    else if (statement.falseStatement)
      this.visit(statement.falseStatement);
  }
  WhileStatement(statement) {
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
  ReturnStatement(ret) {
    const ex = new ReturnException();
    ex.value = this.visit(ret.expr);
    throw ex;
  }
  JumpStatement(statement) {
    const jump = statement.destination.name == TOKEN.BREAK ? new BreakException() : new ContinueException();
    const distance = this.visit(statement.distance || new Literal(1));
    if (!isNumber(distance))
      throw new RuntimeError("expected numerical distance");
    jump.distance = distance;
    throw jump;
  }
  Literal(expr) {
    return expr.value;
  }
  Logical(expr) {
    const { operator: { name: op } } = expr;
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
  Variable(expr) {
    return this.env.get(expr.name.text);
  }
  Assign(assign) {
    this.env.set(assign.name.text, this.visit(assign.expr));
    return this.env.get(assign.name.text);
  }
  Unary(expr) {
    const { operator: { name: op } } = expr;
    const value = this.visit(expr.operand);
    if (op == TOKEN.BANG)
      return !truthy(value);
    if (!isNumber(value))
      throw new RuntimeError("must negate a number value");
    if (op == TOKEN.DASH)
      return -value;
    throw new RuntimeError("Unexpected unary expression");
  }
  Binary(expr) {
    const { operator: { name: op } } = expr;
    const left = this.visit(expr.left);
    const right = this.visit(expr.right);
    if (op == TOKEN.COMMA)
      return right;
    if (op == TOKEN.PLUS) {
      if (isString(left) || isString(right)) {
        return `${left}${right}`;
      }
    }
    if (!isNumber(left) || !isNumber(right))
      throw new RuntimeError("number values expected");
    if (op == TOKEN.PLUS)
      return left + right;
    if (op == TOKEN.DASH)
      return left - right;
    if (op == TOKEN.STAR)
      return left * right;
    if (op == TOKEN.SLASH)
      return left / right;
    if (op == TOKEN.GREATER)
      return left > right;
    if (op == TOKEN.GREATER_EQUAL)
      return left >= right;
    if (op == TOKEN.LESS)
      return left < right;
    if (op == TOKEN.LESS_EQUAL)
      return left <= right;
    throw new RuntimeError("Unexpected binary expression");
  }
  Ternary(expr) {
    const { op1: { name: op1 }, op2: { name: op2 } } = expr;
    if (op1 == TOKEN.QUESTION && op2 == TOKEN.COLON) {
      const left = this.visit(expr.left);
      if (truthy(left))
        return this.visit(expr.middle);
      return this.visit(expr.right);
    }
    throw new RuntimeError("Unexpected ternary expression");
  }
  Grouping(expr) {
    return this.visit(expr.inner);
  }
  Block(block) {
    const previous = this.env;
    this.env = new Environment(previous);
    try {
      block.statements.map((stmt) => this.visit(stmt));
    } finally {
      this.env = previous;
    }
  }
};
__name(Evaluator, "Evaluator");

// src/stoa.ts
var StoaLang = new Language2({ name, version, author, description, repository, license }, { Scanner, Parser: Parser2 });
new CliDriver(StoaLang, { Printer, Evaluator }).run();
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/*!
 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * define-property <https://github.com/jonschlinkert/define-property>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * is-accessor-descriptor <https://github.com/jonschlinkert/is-accessor-descriptor>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * is-data-descriptor <https://github.com/jonschlinkert/is-data-descriptor>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * is-descriptor <https://github.com/jonschlinkert/is-descriptor>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/*!
 * is-windows <https://github.com/jonschlinkert/is-windows>
 *
 * Copyright © 2015-2018, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * strip-color <https://github.com/jonschlinkert/strip-color>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
