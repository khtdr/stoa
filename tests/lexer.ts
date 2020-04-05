import { lex, make } from '../src/lexer'

test('empty input', () => {
    expect(lex('')).toEqual([make('endOfInput')])})

test('fixed-length tokens', () => {
    expect(lex('<-~~=>=:.<>()+-*/?#;; with a comment')).toEqual(
        [make('leftArrow'),
         make('doubleSquirt'),
         make('rightFatArrow'),
         make('equal'),
         make('colon'),
         make('dot'),
         make('leftAngle'),
         make('rightAngle'),
         make('leftParen'),
         make('rightParen'),
         make('plus'),
         make('minus'),
         make('star'),
         make('slash'),
         make('question'),
         make('pound'),
         make('comment', ';; with a comment'),
         make('endOfInput')])})

test('varying length tokens', () => {
    expect(lex('123   joey 32m')).toEqual(
        [make('digits', '123'),
         make('space', '   '),
         make('identifier', 'joey'),
         make('space', ' '),
         make('digits', '32'),
         make('identifier', 'm'),
         make('endOfInput')])})

test('1-digit number', () => {
    expect(lex('0')).toEqual([
        make('digits', '0'),
        make('endOfInput')])})

test('2-digit number', () => {
    expect(lex('13')).toEqual([
        make('digits', '13'),
        make('endOfInput')])})

test('10-digit number', () => {
    expect(lex('0123456789')).toEqual([
        make('digits', '0123456789'),
        make('endOfInput')])})

test('identifier', () => {
    expect(lex('joey')).toEqual([
        make('identifier', 'joey'),
        make('endOfInput')])})

test('numbers with spaces', () => {
    const lexemes = lex('1 2 3 4')
    expect(lexemes.length).toBe(8)
    expect(lexemes[4]).toEqual(make('digits', '3'))})

test('bad input', () => {
    const lexemes = lex('j@1')
    expect(lexemes.length).toBe(4)
    expect(lexemes).toEqual([
        make('identifier', 'j'),
        make('invalid', '@'),
        make('digits', '1'),
        make('endOfInput')])})

const program = `
    ;; iterative version
    =>(factorial n :
        <-(value 1)
        #(i 1 +(n 1)
            <-(value *(value i))))`
test('factorial', () => {
    const lexemes = lex(program)
    expect(lexemes.length).toBe(45)
    expect(lexemes[1]).toEqual(make('comment', ';; iterative version'))
    expect(lexemes[37]).toEqual(make('identifier', 'value'))})

test('comments', () => {
    const lexemes = lex(
        `1 ;; a comment
         ;; another comment
         42`)
    expect(lexemes.filter(l => l.name != 'space')).toEqual([
        make('digits', '1'),
        make('comment', ';; a comment'),
        make('comment', ';; another comment'),
        make('digits', '42'),
        make('endOfInput')])})
