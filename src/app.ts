//import * as chalk from 'chalk'
import * as opts from 'opts'
import { readFileSync } from 'fs'
import { version } from '../package.json'
import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'
import { evaluate } from './interpreter'


opts.parse([
    { short: 'r', long: 'repl' },
    { short: 't', long: 'tokenize' },
    { short: 'p', long: 'parse' },
    { short: 'v', long: 'version' },
], true)

if (opts.get('version')) {
    console.log('stoa', version)
    process.exit()}

const program = readFileSync('/dev/stdin').toString()
const lexemes = lex(program)
const tokens  = tokenize(lexemes)
if (opts.get('tokenize')) {
    console.log(JSON.stringify(tokens))
    process.exit()}

const scanner = scan(tokens)
const ast     = parse(scanner)
if (opts.get('parse')) {
    console.log(JSON.stringify(ast))
    process.exit()}

const output  = evaluate(ast)
console.log(output)
