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

// lib/repl-kit/index.ts
var repl_kit_exports = {};
__export(repl_kit_exports, {
  Repl: () => Repl
});
module.exports = __toCommonJS(repl_kit_exports);
var Repl = class {
  constructor(lang) {
    this.lang = lang;
    this.prompt_width = 0;
  }
  prompt() {
    this.prompt_width = 2;
    process.stdout.write("> ");
  }
  async run() {
    const { stdin, stdout } = process;
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    console.log("help: ?\u23CE");
    console.log("exit: CTRL-d");
    stdin.resume();
    let line = "";
    this.prompt();
    return new Promise((resolve) => {
      stdin.on("data", (key) => {
        stdin.pause();
        if ([""].includes(key.toString())) {
          stdin.destroy();
          resolve(void 0);
        }
        if (!key.toString().match(/[\p{Cc}\p{Cn}\p{Cs}]+/gu)) {
          line += key.toString();
          stdout.write(key);
        }
        if (key.toString() == "\x1B[C") {
          process.stdout.moveCursor(-1, 0);
        }
        if (key.toString() == "\x1B[D") {
          process.stdout.moveCursor(1, 0);
        }
        if (["\x7F"].includes(key.toString())) {
          line = line.substring(0, line.length - 1);
          process.stdout.cursorTo(0);
          process.stdout.clearLine(0);
          this.prompt();
          stdout.write(line);
        }
        if (["\r", "\n"].includes(key.toString())) {
          process.stdout.moveCursor(0, 1);
          process.stdout.cursorTo(0);
          console.log("");
          this.lang.run("repl", line);
          line = "";
          this.prompt();
        }
        stdin.resume();
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Repl
});
