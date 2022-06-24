import {Parser, shorthand } from '../src/sage/parser'
const {
    choose,
    each,
    maybe,
    regex,
    rule,
    star,
} = shorthand

const parser = new Parser()
parser.grammar.start = rule('Expr')
parser.grammar.rules.set('Expr', rule('Sum'))
parser.grammar.rules.set('Sum', each([
    rule('Product'),
    star(each([choose(['+', '-']), rule('Product')]))
]))
parser.grammar.rules.set('Product', each([
    rule('Power'),
    star(each([choose(['*', '/']), rule('Power')]))
]))
parser.grammar.rules.set('Power', each([
    rule('Value'),
    maybe(each(['^', rule('Power')]))
]))
parser.grammar.rules.set('Value', choose([
    regex('[0-9]+'),
    each(['(', rule('Expr'), ')'])
]))
/*
Expr    <- Sum
Sum     <- Product *(['+' '-'] Product)
Product <- Power *(['*' '/'] Power)
Power   <- Value ?('^' Power^)
Value   <- [/[0-9]+/ ('(' Expr ')')]
 */
// const clog = (data :any) => console.log(JSON.stringify(data, null, 2))
// clog(parser.parse('2^(1+1)'))

test('empty input', () => {
})


//const lang = {
    // program = expr END
    //'program': one('expr').one('END'),
    // expr  = term-list|term
    // term-list = ':' expr+ ('.'|')'|END))?
    // term = callable|scalar
    // callable = call|assignment|flow|operator
    // call = identifier '(' args ')'
    // assignment = variable|function
    // variable = '<-' '(' identifier expr ')'
    // function = '=>' '(' identifier identifier* expr ')'
    // operator = (op-comp|op-math|op-builtin) "(" args ")"
    // op-comp = '='|'<'|'>'
    // op-math = '+'|'-'|'*'|'/'
    // op-builtin = '~~'
    // flow = flow-if|flow-for
    // flow-if = '?' '(' expr expr expr? ')'
    // flow-for = '#' '(' identifier expr expr expr ')'
    // args = expr*
    // scalar = identifier|digits
    // digits = /^\d+/
    // identifier = /^\w[\w\d]*/
//}
