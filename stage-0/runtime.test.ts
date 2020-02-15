import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'
import { evaluate } from './runtime'


test('program: 5', () => {
    const ast = parse(scan(tokenize(lex('5'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(5)})

test('program: +(8 :12 3 56.)', () => {
    const ast = parse(scan(tokenize(lex('+(8 :12 3 56.)'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(64)})

test('program: +(6 *(12 3))', () => {
    const ast = parse(scan(tokenize(lex('+(6 *(12 3))'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(42)})

test('program: +(6 :5 4 3 2 1)', () => {
    const ast = parse(scan(tokenize(lex('+(6 :5 4 3 2 1)'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(7)})

test('program: /(1 0)', () => {
    const ast = parse(scan(tokenize(lex('/(1 0)'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(Infinity)})

test('program: -(0 0)', () => {
    const ast = parse(scan(tokenize(lex('-(0 0)'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(0)})

test('program: : <-(a 1) a', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 1) a'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(1)})

test('program: : <-(a 1) <-(b a) <-(c b) c', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 1) <-(b a) <-(c b) c'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(1)})

test('program: : <-(a 2) <-(b 4) +(*(a b) 8).', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 2) <-(b 4) +(*(a b) 8).'))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(16)})

/*
const rec_fac = `:
=>( factorial n
 ?( =(n 0) 1
    *(n factorial( -(n 1) ))))
(factorial 3)
`
test(`program: ${rec_fac}`, () => {
    const ast = parse(scan(tokenize(lex(rec_fac))))
    expect(ast).not.toBe(undefined)
    expect(evaluate(ast)).toBe(6)})
 */
