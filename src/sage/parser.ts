

// ===== Primary Library Classes

export class Parser {
    constructor (readonly grammar :Grammar = new Grammar()) {}
    text = (_index :number, _length? :number) => ''
    parse (text :string) {
        this.text = (index, length) => text.substr(index, length)
        const start = Sequence([this.grammar.start, EmptyString()])
        const root = start(this, 0)
        return root
            ? {ast: root.ast[0], length: root.length}
            : undefined}}

export class Grammar {
    readonly rules = new Rules
    public start! :Expression
    public whitespace = RegexTerm('[\s\r\n]+')
    public comment = RegexTerm('//.*')}


// ===== Terminal Parsers

export const LiteralTerm :Terminator = symbol => (
    (parser, index) => {
        return (parser.text(index, symbol.length) == symbol)
            ? {ast:symbol, length:symbol.length}
            : undefined})

export const RegexTerm :Terminator = regex => (
    (parser, index) => {
        const match = parser.text(index).match(new RegExp(`^${regex}`))
        return match
            ? {ast: match[0], length:match[0].length}
            : undefined})

export const EmptyString :Terminator<void> = () => (
    (parser, index) => {
        return (parser.text(index, 1) == '')
            ? {ast: '', length:0}
            : undefined})


// ===== the Non-Terminal Parser

 export const NonTerm :NonTerminator = symbol => (
     (parser, index) => {
         const success = parser.grammar.rules.get(symbol)!(parser, index)
         return success
             ? {ast: {[symbol]: success.ast}, length:success.length}
             : undefined})


// ===== Operator Parsers

export const Sequence :Operator<Expression[], Ast[]> = exprs => (
    (parser, index) => {
        const ast :Ast = []
        let next = index
        for (let n=0; n<exprs.length; n++) {
            const success = exprs[n](parser, next)
            if (success) {
                next += success.length
                ast.push(success.ast)}
            else return undefined}
        return {length:next-index, ast}})

export const OrderedChoice :Operator<Expression[]> = exprs => (
    (parser, index) => {
        for (let n=0; n<exprs.length; n++) {
            const success = exprs[n](parser, index)
            if (success) return success}
        return undefined})

export const Optional :Operator = expr => (
    (parser, index) => {
        const success = expr(parser, index)
        return success
            ? success
            : {ast: '', length: 0}})

export const ZeroOrMore :Operator<Expression, Ast[]> = expr => (
    (parser, index) => {
        const ast :Ast = []
        let next = index
        while (true) {
            const success = expr(parser, next)
            if (!success) break
            ast.push(success.ast)
            next += success.length}
        return {ast, length: next-index}})

export const OneOrMore :Operator<Expression, Ast[]> = expr => (
    (parser, index) => {
        const ast :Ast = []
        let next = index
        while (true) {
            const success = expr(parser, next)
            if (!success) break
            ast.push(success.ast)
            next += success.length}
        return ast.length > 0
            ? {ast, length: next-index}
            : undefined})


// ===== Shorthand

type ShortExpr = Expression|string

const literalizer = (expr :ShortExpr) => (
    typeof expr == 'string' ? LiteralTerm(expr) : expr)

export const shorthand = {
    rule: NonTerm,
    lit: LiteralTerm,
    regex: RegexTerm,
    choose: (exprs :ShortExpr[]) => OrderedChoice(exprs.map(literalizer)),
    each: (exprs :ShortExpr[]) => Sequence(exprs.map(literalizer)),
    maybe: (expr :ShortExpr) => Optional(literalizer(expr)),
    plus: (expr :ShortExpr) => OneOrMore(literalizer(expr)),
    star: (expr :ShortExpr) => ZeroOrMore(literalizer(expr)),
}


// ===== Supporting Cast

export type Leaf = string
export type Term = {[symbol :string] :Ast}
export type List = Ast[]
export type Ast = Leaf | Term | List
export type Outcome<T extends Ast = Ast> = Success<T> | Failure
export type Success<T extends Ast = Ast> = {ast :T, length :number}
export type Failure = undefined
export class Rules extends Map<string, Expression> {}
export interface Expression<Ret extends Ast=Ast> {(parser :Parser, index :number) :Outcome<Ret>}
export interface Generator<Args=Expression, Ret extends Ast=Ast> {(args :Args) :Expression<Ret>}
export type Terminator<T=string> = Generator<T, Leaf>
export type NonTerminator = Generator<string, Term>
export type Operator<T=Expression, R extends Ast=Ast> = Generator<T, R>

//function isLeaf (ast :Ast) :ast is Leaf {return ast instanceof String}
//function isList (ast :Ast) :ast is List {return Array.isArray(ast)}
//function isTerm (ast :Ast) :ast is Term {return !isLeaf(ast) && !isList(ast)}

// export const AndPred :Generator = expr => (
//     (g :Grammar, p :Parser, i :number) => {
//         const outcome = expr(g, p, i)
//         return (outcome.status == 'success')
//             ? {...outcome, length:0}
//             : {status:'failure'}})

// export const NotPred = (expr: Expression) :Expression => (
//     (g :Grammar, p :Parser, i :number) => {
//         const outcome = expr(g, p, i)
//         return (outcome.status == 'success')
//             ? {status:'failure'}
//             : {...outcome, length:0, nodes:{NotPred:null}}})


// function merge (...nodes :Node[]) {
//     let node :Node = {}
//     nodes.forEach(
//         _node => Object.keys(_node).forEach(
//             name => node[name] = _node[name]))
//     return node
// }

// function rename (node :Node, name :string) {
//     if (Array.isArray(node) || !node) return {[name]:node}
//     const oldNames = Object.keys(node)
//     if (oldNames.length != 1) return {[name]:node}
//     return {[name]:node[oldNames[0]]}
// }

// console.log(merge({Age:'32',Name:'Joey'}, {Job:'Programmer'}))
