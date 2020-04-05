import { readFileSync } from 'fs'
import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'
import { evaluate } from './runtime'

const program = readFileSync('/dev/stdin').toString()
const lexemes = lex(program)
const tokens  = tokenize(lexemes)
const scanner = scan(tokens)
const ast     = parse(scanner)
const output  = evaluate(ast)

console.log(output)
