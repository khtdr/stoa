import { lex, lookup } from './lexer'
import { tokenize } from './tokenizer'

test('empty input', () => {
	expect(tokenize(lex(''))).toEqual([{
		line: 1, column: 1, ...lookup('endOfInput')}])})

test('single token', () => {
	expect(tokenize(lex(':'))).toEqual([{
		line: 1, column: 1, ...lookup('colon')},{
		line: 1, column: 2, ...lookup('endOfInput')}])})

test('bad input', () => {
	expect(tokenize(lex('camelCased@'))).toEqual([{
		line: 1, column: 1, ...lookup('identifier', 'camelCased')},{
		line: 1, column: 11, ...lookup('invalid', '@')},{
		line: 1, column: 12, ...lookup('endOfInput')}])})

test('skips spaces', () => {
	expect(tokenize(lex('< <-'))).toEqual([{
		line: 1, column: 1, ...lookup('leftAngle')}, {
    	line: 1, column: 3, ...lookup('leftArrow')}, {
		line: 1, column: 5, ...lookup('endOfInput')}])})

const lines = `line1

3:
4: x2 x3. 43 def()
5: x x. 43 function`
test('with newlines', () => {
	const tokens = tokenize(lex(lines))
	expect(tokens.pop()).toEqual({
		line:5, column:20, ...lookup('endOfInput')})
	expect(tokens.pop()).toEqual({
		line:5, column:12, ...lookup('identifier', 'function')})})
