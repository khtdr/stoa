import { Language } from "stoa-ltk";
import { version } from "../../package.json";
import { Ast } from "./ast/nodes";
import { Tokenizer, Lexicon } from "./tokenizer";
import { Parser } from "./parser";
import { Resolver } from "./resolver";
import { Interpreter } from "./interpreter";
import { Result } from "./runtime/values";

export class StoxLang extends Language<Lexicon, Ast, Result> {

    readonly version = version
    Tokenizer = Tokenizer;
    Parser = Parser;
    Resolver = Resolver;
    Interpreter = Interpreter;
}
