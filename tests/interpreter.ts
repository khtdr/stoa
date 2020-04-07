import { lex } from '../src/lexer'
import { tokenize } from '../src/tokenizer'
import { scan } from '../src/scanner'
import { parse } from '../src/parser'
import { evaluate, Frame } from '../src/interpreter'


test('program: 5', () => {
    const ast = parse(scan(tokenize(lex('5'))))
    expect(evaluate(ast)[0]).toBe(5)})

test('program: +(8 :12 3 56.)', () => {
    const ast = parse(scan(tokenize(lex('+(8 :12 3 56.)'))))
    expect(evaluate(ast)[0]).toBe(64)})

test('program: +(6 *(12 3))', () => {
    const ast = parse(scan(tokenize(lex('+(6 *(12 3))'))))
    expect(evaluate(ast)[0]).toBe(42)})

test('program: +(6 :5 4 3 2 1)', () => {
    const ast = parse(scan(tokenize(lex('+(6 :5 4 3 2 1)'))))
    expect(evaluate(ast)[0]).toBe(7)})

test('program: /(1 0)', () => {
    const ast = parse(scan(tokenize(lex('/(1 0)'))))
    expect(evaluate(ast)[0]).toBe(Infinity)})

test('program: -(0 0)', () => {
    const ast = parse(scan(tokenize(lex('-(0 0)'))))
    expect(evaluate(ast)[0]).toBe(0)})

test('program: : <-(a 1) a', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 1) a'))))
    expect(evaluate(ast)[0]).toBe(1)})

test('program: : <-(a 1) <-(b a) <-(c b) c', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 1) <-(b a) <-(c b) c'))))
    expect(evaluate(ast)[0]).toBe(1)})

test('program: : <-(a 2) <-(b 4) +(*(a b) 8).', () => {
    const ast = parse(scan(tokenize(lex(': <-(a 2) <-(b 4) +(*(a b) 8).'))))
    expect(evaluate(ast)[0]).toBe(16)})

test(`simple if statement`, () => {
    const ast = parse(scan(tokenize(lex('?(=(1 9) 1 99)'))))
    expect(evaluate(ast)[0]).toBe(99)})

test(`if statement #2`, () => {
    const ast = parse(scan(tokenize(lex(': <-(a 1) ?(=(1 a) <-(a 123) <-(a 456)) a'))))
    expect(evaluate(ast)[0]).toBe(123)})

test(`simple loop`, () => {
    const ast = parse(scan(tokenize(lex('#(n 1 3 n)'))))
    expect(evaluate(ast)[0]).toBe(3)})

test(`vars of vars : 2`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n 10) <-(b n) <-(x b) b'))))
    expect(evaluate(ast)[0]).toBe(10)})

test(`vars of vars : 3`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n 10) <-(b n) <-(x b) x'))))
    expect(evaluate(ast)[0]).toBe(10)})

test(`vars of vars : 4`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n 10) <-(b n) <-(n 12) b'))))
    expect(evaluate(ast)[0]).toBe(10)})

test(`vars of vars : 5`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n b) <-(b n) b'))))
    expect(evaluate(ast)[0]).toBeUndefined()})

test(`vars of vars : 6`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n b) <-(b n) <-(n 13) b'))))
    expect(evaluate(ast)[0]).toBeUndefined()})

test(`vars of vars : 7`, () => {
    const ast = parse(scan(tokenize(lex(': <-(n b) <-(b n) <-(n 13) n'))))
    expect(evaluate(ast)[0]).toEqual(13)})

test(`subsequent evals`, () => {
    const assign = parse(scan(tokenize(lex('<-(n 1)'))))
    const incer = parse(scan(tokenize(lex('=>(inc n : +(1 n))'))))
    const bumper = parse(scan(tokenize(lex('<-(n inc(n))'))))
    const assigned = evaluate(assign) as [string|number, Frame]
    expect(assigned[0]).toEqual(1)
    const inced = evaluate(incer, assigned[1]) as [string, Frame]
    expect(inced[0]).toEqual('inc')
    let bumped = evaluate(bumper, inced[1]) as [number, Frame]
    expect(bumped[0]).toEqual(2)
    bumped = evaluate(bumper, inced[1]) as [number, Frame]
    expect(bumped[0]).toEqual(3)})

const fact_for_loop = `::::
: <-(n 3)
  <-(value 1)
  #(i 1 n
    <-(value *(value i)))
`
test(`factorial for loop`, () => {
    const ast = parse(scan(tokenize(lex(fact_for_loop))))
    expect(evaluate(ast)[0]).toBe(6)})

test(`simple function 1`, () => {
    const ast = parse(scan(tokenize(lex(': =>(fn 12) fn()'))))
    expect(evaluate(ast)[0]).toBe(12)})

test(`simple function 2`, () => {
    const ast = parse(scan(tokenize(lex(': =>(adder n +(1 n)) adder(1)'))))
    expect(evaluate(ast)[0]).toBe(2)})

test(`simple function 3`, () => {
    const ast = parse(scan(tokenize(lex(': =>(math n1 n2 : <-(n +(n1 n2)) *(n n)) math(1 2)'))))
    expect(evaluate(ast)[0]).toBe(9)})

const fact_loop = `:
=>(factorial n :
    <-(value 1)
    #(i 1 n
        <-(value *(value i))))
factorial(5)
`
test(`factorial via looping`, () => {
    const ast = parse(scan(tokenize(lex(fact_loop))))
    expect(evaluate(ast)[0]).toBe(120)})

const rec_fac = `:
;; the recursive version
=>( factorial n
 ?( =(n 0) 1 ;; how big is the stack?!
    *(n factorial( -(n 1) ))))
factorial(3)
`
test(`program: ${rec_fac}`, () => {
    const ast = parse(scan(tokenize(lex(rec_fac))))
    expect(evaluate(ast)[0]).toBe(6)})

const itr_fact_with_spaces = `:
;; the iterative version
=> (factorial n :
    <- (value 1)
    # (i 1 n
        <- (value *(value i))))
factorial(4)
`
test(`program: ${itr_fact_with_spaces}`, () => {
    const ast = parse(scan(tokenize(lex(itr_fact_with_spaces))))
    expect(evaluate(ast)[0]).toBe(24)})

test('printing', () => {
    const clog = console.log
    const log = console.log = jest.fn()
    const ast = parse(scan(tokenize(lex('~~(5)'))))
    expect(evaluate(ast)[0]).toBe(5)
    expect(log.mock.calls[0][0]).toBe(5)
    console.log = clog})

test('printing an expression', () => {
    const clog = console.log
    const log = console.log = jest.fn()
    const ast = parse(scan(tokenize(lex('~~(*(5 4))'))))
    expect(evaluate(ast)[0]).toBe(20)
    expect(log.mock.calls[0][0]).toBe(20)
    console.log = clog})

test('lots of printing', () => {
    const clog = console.log
    const log = console.log = jest.fn()
    const ast = parse(scan(tokenize(lex(
        `~~(1) #(n 2 9 ~~(n)) ~~(10)`
    ))))
    expect(evaluate(ast)[0]).toBe(10)
    expect(log.mock.calls.length).toBe(10)
    expect(log.mock.calls[0][0]).toBe(1)
    expect(log.mock.calls[9][0]).toBe(10)
    console.log = clog})
