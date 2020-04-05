import * as chalk from 'chalk'
import * as opts from 'opts'
import { readFileSync } from 'fs'
import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'
import { evaluate } from './interpreter'


opts.parse([
    { short: 'r', long: 'repl' },
    { short: 'f', long: 'file' },
    { short: 't', long: 'tokenize' },
    { short: 'p', long: 'parse' },
    { short: 'v', long: 'version' },
], true)


console.log('hello, goodbye, wh.k....good boy.')

const program = readFileSync('/dev/stdin').toString()
const lexemes = lex(program)
const tokens  = tokenize(lexemes)
const scanner = scan(tokens)
const ast     = parse(scanner)
const output  = evaluate(ast)

console.log(output)
