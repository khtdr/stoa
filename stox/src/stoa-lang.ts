import { Language } from "stoa-ltk";
import { version } from "../../package.json";
import { Visitable } from "./ast/index";
import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";
import { Resolver } from "./resolver";
import { Interpreter } from "./interpreter";
import { Result } from "runtime/base";

export class StoxLang
    extends Language<typeof Tokenizer.lexicon, Visitable, Result> {

    readonly version = version
    Tokenizer = Tokenizer;
    Parser = Parser;
    Resolver = Resolver;
    Interpreter = Interpreter;
}
