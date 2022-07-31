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
  }
  async run() {
    return new Promise((resolve) => resolve(void 0));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Repl
});
