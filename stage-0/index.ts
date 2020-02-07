//@ts-ignore
import { readFileSync } from 'fs'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { Runtime } from './runtime'

const program = readFileSync('/dev/stdin').toString()
const tokens = new Lexer(program).tokenize()
const ast = new Parser(tokens).parse()
const output = new Runtime(ast).evaluate()

console.log(output)
