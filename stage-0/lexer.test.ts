import { lex, lookup } from './lexer'

test('empty input', () => {
    expect(lex('')).toEqual([lookup('endOfInput')])})

test('fixed-length tokens', () => {
    expect(lex('<-=>=:.<>()+-*/?#')).toEqual(
        [lookup('leftArrow'),
         lookup('rightFatArrow'),
         lookup('equal'),
         lookup('colon'),
         lookup('dot'),
         lookup('leftAngle'),
         lookup('rightAngle'),
         lookup('leftParen'),
         lookup('rightParen'),
         lookup('plus'),
         lookup('minus'),
         lookup('star'),
         lookup('slash'),
         lookup('question'),
         lookup('pound'),
         lookup('endOfInput')])})

test('varying length tokens', () => {
    expect(lex('123   joey 32m')).toEqual(
        [lookup('digits', '123'),
         lookup('space', '   '),
         lookup('identifier', 'joey'),
         lookup('space', ' '),
         lookup('digits', '32'),
         lookup('identifier', 'm'),
         lookup('endOfInput')])})

test('1-digit number', () => {
    expect(lex('0')).toEqual([
        lookup('digits', '0'),
        lookup('endOfInput')])})

test('2-digit number', () => {
    expect(lex('13')).toEqual([
        lookup('digits', '13'),
        lookup('endOfInput')])})

test('10-digit number', () => {
    expect(lex('0123456789')).toEqual([
        lookup('digits', '0123456789'),
        lookup('endOfInput')])})

test('identifier', () => {
    expect(lex('joey')).toEqual([
        lookup('identifier', 'joey'),
        lookup('endOfInput')])})

test('numbers with spaces', () => {
    const lexemes = lex('1 2 3 4')
    expect(lexemes.length).toBe(8)
    expect(lexemes[4]).toEqual(lookup('digits', '3'))})

test('bad input', () => {
    const lexemes = lex('j@1')
    expect(lexemes.length).toBe(4)
    expect(lexemes).toEqual([
        lookup('identifier', 'j'),
        lookup('invalid', '@'),
        lookup('digits', '1'),
        lookup('endOfInput')])})

const program = `
    =>(factorial n :
        <-(value 1)
        #(i 1 +(n 1)
            <-(value *(value i))))`
test('factorial', () => {
    const tokens = lex(program)
    expect(tokens.length).toBe(43)
    expect(tokens[35]).toEqual(lookup('identifier', 'value'))})
