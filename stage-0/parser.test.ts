import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'


test('empty program', () => {
    const program = ''
    const ast = parse(scan(tokenize(lex(program))))
    expect(ast).toBe(undefined)})

test('number', () => {
    const program = '1'
    const ast = parse(scan(tokenize(lex(program))))
    expect(ast).toEqual({
        name: "program",
        value: {
            name: "expr",
            value: {
                name: "term",
                value: {
                    name: "scalar",
                    value: {
                        name: "digits",
                        value: "1"}}}}})})

test('number', () => {
    const ast = parse(scan(tokenize(lex('1234'))))
    expect(ast).toEqual({
        name: "program",
        value: {
            name: "expr",
            value: {
                name: "term",
                value: {
                    name: "scalar",
                    value: {
                        name: "digits",
                        value: "1234"}}}}})})

test('variable name', () => {
    const ast = parse(scan(tokenize(lex('var1234'))))
    expect(ast).toEqual({
        name: "program",
        value: {
            name: "expr",
            value: {
                name: "term",
                value: {
                    name: "scalar",
                    value: {
                        name: "identifier",
                        value: "var1234"}}}}})})

test('variable assignment', () => {
    const ast = parse(scan(tokenize(lex(`<-(value 1)`))))
    expect(ast).not.toEqual(undefined)})

test('bad list of exprs', () => {
    const ast = parse(scan(tokenize(lex(`n n`))))
    expect(ast).toEqual(undefined)})

test('list of exprs', () => {
    const ast = parse(scan(tokenize(lex(':n n.'))))
    expect(ast).not.toEqual(undefined)})

test('nested list of exprs', () => {
    const ast = parse(scan(tokenize(lex(`:+(1 1) n.`))))
    expect(ast).not.toEqual(undefined)})

test('nested list of exprs', () => {
    const ast = parse(scan(tokenize(lex(`:+(1 1) :*(2 3) /(3 4). -(4 5)`))))
    expect(ast).not.toEqual(undefined)})

test('nested list of exprs', () => {
    const ast = parse(scan(tokenize(lex(`:n :+(1 1) +(2 2). n.`))))
    expect(ast).not.toEqual(undefined)})

test('multiplication definition', () => {
    const ast = parse(scan(tokenize(lex(`*(n n)`))))
    expect(ast).not.toEqual(undefined)})

test('multiplication assignment ', () => {
    const ast = parse(scan(tokenize(lex(`<-(val *(n n))`))))
    expect(ast).not.toEqual(undefined)})

test('big multiplication assignment ', () => {
    const ast = parse(scan(tokenize(lex(`<-(val +(3 -(70 2) *(n n)))`))))
    expect(ast).not.toEqual(undefined)})

test('for', () => {
    const ast = parse(scan(tokenize(lex(`#(n 1 1 n)`))))
    expect(ast).not.toEqual(undefined)})

test('bad for 1', () => {
    const ast = parse(scan(tokenize(lex(`#(n 1 1)`))))
    expect(ast).toEqual(undefined)})

test('bad for 2', () => {
    const ast = parse(scan(tokenize(lex(`#(1 1 1 n)`))))
    expect(ast).toEqual(undefined)})

test('basic function', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn 1)`))))
    expect(ast).not.toEqual(undefined)})

test('function with body', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn :1 2.)`))))
    expect(ast).not.toEqual(undefined)})

test('function with one param', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn n 1)`))))
    expect(ast).not.toEqual(undefined)})

test('function with two params', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn n1 n2 1)`))))
    expect(ast).not.toEqual(undefined)})

test('adder', () => {
    const ast = parse(scan(tokenize(lex(`=>(add a b +(a b))`))))
    expect(ast).not.toEqual(undefined)})

test('identity function', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn n n)`))))
    expect(ast).not.toEqual(undefined)})

test('math functions', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn n -(1 *(1 2)))`))))
    expect(ast).not.toEqual(undefined)})

test('bigger math functions', () => {
    const ast = parse(scan(tokenize(lex(`=>(fn n -(1 *(5 +(1 2))))`))))
    expect(ast).not.toEqual(undefined)})

test('sequence', () => {
    const ast = parse(scan(tokenize(lex(`=>(add a b :a b.)`))))
    expect(ast).not.toEqual(undefined)})

const factorial = `
    =>(factorial n :
        <-(value 1)
        #(i 1 +(n 1)
            <-(value *(value i))).)`
test('recursive factorial program', () => {
    const ast = parse(scan(tokenize(lex(factorial))))
    expect(ast).not.toEqual(undefined)})

let program = `
    =>(factorial n :
        <-(value 1)
        #(i 1 +(n 1)
            <-(value *(value i))))`
test('...with no period at end', () => {
    const ast = parse(scan(tokenize(lex(program))))
    expect(ast).not.toEqual(undefined)})
