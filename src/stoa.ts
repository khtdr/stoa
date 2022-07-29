import fs from 'fs'
import opts from 'opts'
import { Scanner, Token } from './scanner'
import { Parser } from './parser'
import { Interpreter } from './interpreter';
import { Resolver } from './resolver';
import { Reporter } from './errors';

opts.parse([{ short: 't', description: 'prints tokens and exits ' }], [{ name: "file" }], true);
const fileName = opts.arg("file") ?? "/dev/stdin"

const source = fs.readFileSync(fileName).toString()
const reporter = new Reporter()
reporter.addSource(fileName, source)

const scanner = new Scanner(source, reporter)
const tokens = scanner.drain() as Token[]
if (reporter.errors) {
    console.log(JSON.stringify(reporter.errors, null, 2))
}

if (opts.get('t')) {
    console.log(tokens.map(token => token.toString()).join('\n'))
    process.exit(0)
}

const parser = new Parser(tokens, reporter)
const interpreter = new Interpreter(reporter);
const resolver = new Resolver(interpreter, reporter)

const ast = parser.parse()
if (reporter.errors) {
    reporter.parseError()
    process.exit(1)
}

resolver.visit(ast)
if (reporter.errors) {
    reporter.parseError()
    process.exit(1)
}

interpreter.visit(ast)
if (reporter.errors) {
    reporter.runtimeError()
    process.exit(1)
}

process.exit(0)
