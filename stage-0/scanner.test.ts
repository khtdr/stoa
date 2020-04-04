import { lex, make } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { UnrecognizedInput } from './errors'

test('peek nothing', () => {
    const scanner = scan(tokenize(lex('')))
    expect(scanner.peek('colon'))
        .toBeUndefined()})

test('peek unmatching', () => {
    const scanner = scan(tokenize(lex('1234')))
    expect(scanner.peek('colon'))
        .toBeUndefined()})

test('peek matching token', () => {
    const scanner = scan(tokenize(lex('.')))
    expect(scanner.peek('dot'))
        .toEqual({...make('dot'), column:1, line:1})})

test('peek end of input', () => {
    const scanner = scan(tokenize(lex('')))
    expect(scanner.peek('endOfInput'))
        .toEqual({...make('endOfInput'), column:1, line:1})})

test('peek invalid', () => {
    const scanner = scan(tokenize(lex('ψ')))
    expect(scanner.peek('invalid'))
        .toEqual({...make('invalid', 'ψ'), column:1, line:1})})

test('take peeked token', () => {
    const scanner = scan(tokenize(lex('.')))
    expect(scanner.peek('dot'))
        .toEqual(scanner.take('dot'))})

test('take unmatching', () => {
    const scanner = scan(tokenize(lex('.')))
    expect(scanner.take('colon'))
        .toBeUndefined()})

test('no errors', () => {
    const scanner = scan(tokenize(lex('.')))
    expect(() => scanner.take('dot'))
        .not.toThrow()})

test('take invalid throws', () => {
    const scanner = scan(tokenize(lex('ψ')))
    expect(() => scanner.take('pound'))
        .toThrow(UnrecognizedInput)})

test('checkpoints', () => {
    const scanner = scan(tokenize(lex('==><*><--')))
    expect(scanner.take('equal')).not.toBeUndefined()
    expect(scanner.take('rightFatArrow')).not.toBeUndefined()
    const revert1 = scanner.checkpoint()
    expect(scanner.take('leftAngle')).not.toBeUndefined()
    const revert2 = scanner.checkpoint()
    expect(scanner.take('star')).not.toBeUndefined()
    expect(scanner.take('star')).toBeUndefined()
    revert2()
    expect(scanner.take('star')).not.toBeUndefined()
    expect(scanner.take('rightAngle')).not.toBeUndefined()
    expect(scanner.take('colon')).toBeUndefined()
    revert1()
    expect(scanner.take('leftAngle')).not.toBeUndefined()
    expect(scanner.take('star')).not.toBeUndefined()
    expect(scanner.take('rightAngle')).not.toBeUndefined()
    expect(scanner.take('leftArrow')).not.toBeUndefined()
    expect(scanner.take('minus')).not.toBeUndefined()
    expect(scanner.take('endOfInput')).
        toEqual({...make('endOfInput'), line:1, column:10})})
