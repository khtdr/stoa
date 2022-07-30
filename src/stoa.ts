import fs from 'fs'
import opts from 'opts'
import { version } from '../package.json'
import { Scanner, Token } from './scanner'
import { Parser } from './parser'
import { Interpreter } from './interpreter';
import { Printer } from './printer';
import { Resolver } from './resolver';
import { Reporter } from './errors';

opts.parse([
    { short: 't', description: 'prints tokens and exits ' },
    { short: 'p', description: 'prints parse tree and exits ' },
    { short: 'v', description: 'prints version info and exits ' },
], [{ name: "file" }], true);

if (opts.get('v')) {
    console.log(`stoa-${version}`)
    process.exit(0)
}

const fileName = opts.arg("file") ?? "/dev/stdin"

const source = fs.readFileSync(fileName).toString()
const reporter = new Reporter()
reporter.addSource(fileName, source)

const scanner = new Scanner(source, reporter)
const tokens = scanner.drain() as Token[]
if (reporter.errors) {
    reporter.tokenError()
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
if (opts.get('p')) {
    console.log(new Printer().visit(ast))
    process.exit(0)
}

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
