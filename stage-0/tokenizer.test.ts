import { lex, make } from './lexer'
import { tokenize } from './tokenizer'

test('empty input', () => {
	expect(tokenize(lex(''))).toEqual([{
		line: 1, column: 1, ...make('endOfInput')}])})

test('single token', () => {
	expect(tokenize(lex(':'))).toEqual([{
		line: 1, column: 1, ...make('colon')},{
		line: 1, column: 2, ...make('endOfInput')}])})

test('bad input', () => {
	expect(tokenize(lex('camelCased@'))).toEqual([{
		line: 1, column: 1, ...make('identifier', 'camelCased')},{
		line: 1, column: 11, ...make('invalid', '@')},{
		line: 1, column: 12, ...make('endOfInput')}])})

test('skips spaces', () => {
	expect(tokenize(lex('< <-'))).toEqual([{
		line: 1, column: 1, ...make('leftAngle')}, {
    	line: 1, column: 3, ...make('leftArrow')}, {
		line: 1, column: 5, ...make('endOfInput')}])})

const withNewLines = `line1

3:
4: x2 x3. 43 def()
5: x x. 43 function`
test('with newlines', () => {
	const tokens = tokenize(lex(withNewLines))
	expect(tokens.pop()).toEqual({
		line:5, column:20, ...make('endOfInput')})
	expect(tokens.pop()).toEqual({
		line:5, column:12, ...make('identifier', 'function')})})
