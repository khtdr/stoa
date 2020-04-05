import { Scanner } from './scanner'

export type ProgramNode = {
    name  :'program'
    value :ExprNode[]}

export type ExprNode = {
    name  :'expr'
    value :TermNode|TermListNode}

export type TermNode = {
    name  :'term'
    value :CallableNode|ScalarNode}

export type TermListNode = {
    name  :'term-list'
    value :ExprNode[]}

export type CallableNode = {
    name  :'callable'
    value :CallNode|AssignmentNode|FlowNode|OperatorNode}

export type CallNode = {
    name  : 'call'
    value :{
        identifier :IdentifierNode
        args   :ArgsNode}}

export type AssignmentNode = {
    name  :'assignment'
    value :VariableNode|FunctionNode}

export type VariableNode = {
    name  :'variable'
    value :{
        identifier :IdentifierNode
        expr   :ExprNode}}

export type FunctionNode = {
    name  :'function'
    value :{
        identifier :IdentifierNode
        params :IdentifierNode[]
        expr   :ExprNode}}

export type OperatorNode = {
    name  :'operator'
    value :{
        op   :OpCompNode|OpMathNode|OpBuiltinNode
        args :ArgsNode}}

export type OpCompNode = {
    name  :'op-comp'
    value :'='|'<'|'>'}

export type OpMathNode = {
    name  :'op-math'
    value :'+'|'-'|'/'|'*'}

export type OpBuiltinNode= {
    name  :'op-builtin'
    value :'~~'}

export type FlowNode = {
    name  :'flow'
    value :FlowIfNode|FlowForNode}

export type FlowIfNode = {
    name  :'flow-if'
    value :{
        cond :ExprNode
        yay  :ExprNode
        nay  :ExprNode|void}}

export type FlowForNode = {
    name  :'flow-for'
    value :{
        identifier :IdentifierNode
        start  :ExprNode
        end    :ExprNode
        body   :ExprNode}}

export type ArgsNode = {
    name  :'args'
    value :ExprNode[]}

export type ScalarNode = {
    name  :'scalar'
    value :IdentifierNode|DigitsNode}

export type DigitsNode = {
    name  :'digits'
    value :string}

export type IdentifierNode= {
    name  :'identifier'
    value :string}

export type Node = {
    text?   :string
    line?   :number
    column? :number
} & (
    ExprNode       | TermNode     | CallableNode | CallNode     |
    AssignmentNode | VariableNode | FunctionNode | OperatorNode |
    OpCompNode     | OpMathNode   | FlowNode     | FlowIfNode   |
    FlowForNode    | ArgsNode     | ScalarNode   | DigitsNode   |
    IdentifierNode | TermListNode | ProgramNode)

export function parse (scanner :Scanner) :Node|void {

    return parseProgram()

    // program = expr END
    function parseProgram() :ProgramNode|void {
        const exprs : ExprNode[] = []
        let expr : ExprNode|void
        while (expr = parseExpr()) {exprs.push(expr)}
        if (scanner.take('endOfInput') && exprs.length)
            return {name:'program', value:exprs}}

    // expr  = term-list|term
    function parseExpr() :ExprNode|void {
        const value = parseTermList() || parseTerm()
        if (value)
            return {name:'expr', value}}

    // term-list = ':' expr+ ('.'|')'|END))?
    function parseTermList() :TermListNode|void {
        const revert = scanner.checkpoint()
        const value :ExprNode[] = []
        if (!scanner.take('colon')) return revert()
        let expr = parseExpr()
        if (!expr) return revert()
        value.push(expr)
        while (!scanner.peek('endOfInput') && !scanner.peek('dot') && !scanner.peek('rightParen')) {
            expr = parseExpr()
            if (!expr) return revert()
            value.push(expr)}
        if (scanner.take('dot') || scanner.peek('endOfInput') || scanner.peek('rightParen')) {
            return {name: 'term-list', value}}}

    // term = callable|scalar
    function parseTerm() :TermNode|void {
        const value = parseCallable() || parseScalar()
        if (value) return {name: 'term', value}}

    // callable = call|assignment|flow|operator
    function parseCallable() :CallableNode|void {
        const value =
            parseCall() || parseAssignment() ||
            parseFlow() || parseOperator()
        if (value) return {name: 'callable', value}}

    // call = identifier '(' args ')'
    function parseCall() :CallNode|void {
        const revert = scanner.checkpoint()
        const identifier = parseIdentifier()
        if (!identifier) return revert()
        if (!scanner.take('leftParen')) return revert()
        const args = parseArgs()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'call',
            value: {identifier, args}}}

    // assignment = variable|function
    function parseAssignment() :AssignmentNode|void {
        const value = parseVariable() || parseFunction()
        if (value) return {name: 'assignment', value}}

    // variable = '<-' '(' identifier expr ')'
    function parseVariable() :VariableNode|void {
        const revert = scanner.checkpoint()
        if (!scanner.take('leftArrow')) return revert()
        if (!scanner.take('leftParen')) return revert()
        const identifier = parseIdentifier()
        if (!identifier) return revert()
        const expr = parseExpr()
        if (!expr) return revert()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'variable',
            value: {identifier, expr}}}

    // function = '=>' '(' identifier identifier* expr ')'
    function parseFunction() :FunctionNode|void {
        const revert = scanner.checkpoint()
        if (!scanner.take('rightFatArrow')) return revert()
        if (!scanner.take('leftParen')) return revert()
        const identifier = parseIdentifier()
        if (!identifier) return revert()
        const params :IdentifierNode[] = []
        let symRevert :ReturnType<typeof scanner.checkpoint>|undefined
        let nextRevert = scanner.checkpoint()
        while (true) {
            const param = parseIdentifier()
            if (!param) break
            symRevert = nextRevert
            nextRevert = scanner.checkpoint()
            params.push(param)}
        let expr :ExprNode|void
        if (scanner.peek('rightParen')) {
            if (symRevert) {
                symRevert()
                params.pop()
                expr = parseExpr()}}
        else expr = parseExpr()
        if (!expr) return revert()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'function',
            value: {identifier, params, expr}}}


    // operator = (op-comp|op-math|op-builtin) "(" args ")"
    function parseOperator() :OperatorNode|void {
        const revert = scanner.checkpoint()
        const op = parseOpComp() || parseOpMath() || parseOpBuiltin()
        if (!op) return revert()
        if (!scanner.take('leftParen')) return revert()
        const args = parseArgs()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'operator',
            value: {op, args}}}

    // op-comp = '='|'<'|'>'
    function parseOpComp() :OpCompNode|void {
        const op = scanner.take('equal') ||
            scanner.take('leftAngle') ||
            scanner.take('rightAngle')
        if (op) return {
            name: 'op-comp',
            value: op.text as '='|'<'|'>'}}

    // op-math = '+'|'-'|'*'|'/'
    function parseOpMath() :OpMathNode|void {
        const op = scanner.take('plus') || scanner.take('minus') ||
            scanner.take('star') || scanner.take('slash')
        if (op) return {
            name: 'op-math',
            value: op.text as '+'|'-'|'*'|'/'}}

    // op-builtin = '~~'
    function parseOpBuiltin() :OpBuiltinNode|void {
        const op = scanner.take('doubleSquirt')
        if (op) return {
            name: 'op-builtin',
            value: op.text as '~~'}}

    // flow = flow-if|flow-for
    function parseFlow() :FlowNode|void {
        const value = parseFlowIf() || parseFlowFor()
        if (value)
            return {name: 'flow', value}}

    // flow-if = '?' '(' expr expr expr? ')'
    function parseFlowIf() :FlowIfNode|void {
        const revert = scanner.checkpoint()
        if (!scanner.take('question')) return revert()
        if (!scanner.take('leftParen')) return revert()
        const cond = parseExpr()
        if (!cond) return revert()
        const yay = parseExpr()
        if (!yay) return revert()
        const nay = parseExpr()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'flow-if',
            value: { cond, yay, nay }}}

    // flow-for = '#' '(' identifier expr expr expr ')'
    function parseFlowFor() :FlowForNode|void {
        const revert = scanner.checkpoint()
        if (!scanner.take('pound')) return revert()
        if (!scanner.take('leftParen')) return revert()
        const identifier = parseIdentifier()
        if (!identifier) return revert()
        const start = parseExpr()
        if (!start) return revert()
        const end = parseExpr()
        if (!end) return revert()
        const body = parseExpr()
        if (!body) return revert()
        if (!scanner.take('rightParen')) return revert()
        return {
            name: 'flow-for',
            value: { identifier, start, end, body }}}

    // args = expr*
    function parseArgs() :ArgsNode {
        const value:ExprNode[] = []
        while (true) {
            const expr = parseExpr()
            if (!expr) break
            value.push(expr)}
        return {name: 'args', value}}

    // scalar = identifier|digits
    function parseScalar() :ScalarNode|void {
        const value = parseIdentifier() || parseDigits()
        if (value)
            return {name: 'scalar', value}}

    // digits = /^\d+/
    function parseDigits() :DigitsNode|void {
        const value = scanner.take('digits')
        if (value)
            return {name: 'digits', value:value.text}}

    // identifier = /^\w[\w\d]*/
    function parseIdentifier() :IdentifierNode|void {
        const value = scanner.take('identifier')
        if (value)
            return {name: 'identifier', value:value.text}}}
