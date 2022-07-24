import fs from 'fs'
import opts from 'opts'
import { Scanner, Token } from './scanner'
import { Parser } from './parser'
import { Interpreter } from './interpreter';
import { Resolver } from './resolver';
import { Reporter } from './errors';

opts.parse([], [{ name: "file" }], true);
const fileName = opts.arg("file") ?? "/dev/stdin"

const reporter = new Reporter()
const source = fs.readFileSync(fileName).toString()

const scanner = new Scanner(source)
const tokens = scanner.drain() as Token<any>[]

const parser = new Parser(tokens, reporter)
const interpreter = new Interpreter(reporter);
const resolver = new Resolver(interpreter, reporter)

const ast = parser.parse()
resolver.visit(ast)
interpreter.visit(ast)
