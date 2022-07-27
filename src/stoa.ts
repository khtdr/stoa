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

const scanner = new Scanner(source, reporter)
const tokens = scanner.drain() as Token[]
if (reporter.errors) {
    console.log(JSON.stringify(reporter.errors, null, 2))
}

const parser = new Parser(tokens, reporter)
const interpreter = new Interpreter(reporter);
const resolver = new Resolver(interpreter, reporter)

const ast = parser.parse()
if (reporter.errors) error('Parse', reporter)

resolver.visit(ast)
if (reporter.errors) error('Parse', reporter)

interpreter.visit(ast)
if (reporter.errors) error('Runtime', reporter)

function error(type: string, reporter: Reporter) {
    if (!reporter.errors) return

    const lines = source.split("\n")
    for (const [token, message] of reporter.errors) {
        console.log(`${type} error in ${fileName} at line,col ${token.pos.line},${token.pos.column}`)
        const prefix = `${token.pos.line}. `
        const code = `${lines[token.pos.line - 1]}`
        console.log(`${prefix}${code}`)
        const spaces = `${prefix}${code}`.replace(/./g, ' ')
        const arr = spaces.substring(0, prefix.length + token.pos.column - 1)
        console.log(`${arr}↑`)
        console.log(`${message}`)
    }
    process.exit(1)
}
