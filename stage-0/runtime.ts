import {
    ArgsNode,       AssignmentNode, CallNode,   CallableNode, DigitsNode,
    ExprNode,       FlowForNode,    FlowIfNode, FlowNode,     FunctionNode,
    IdentifierNode, OpCompNode,     OpMathNode, OperatorNode, ProgramNode,
    ScalarNode,     TermListNode,   TermNode,   VariableNode, parse
} from './parser'


export function evaluate(node :ReturnType<typeof parse>) {
    if (!node) return
    switch(node.name) {
        case 'program': return evaluateProgram(node).r1Get().value}}


type TSymbol = { name:'symbol', value:string }
type TNumber = { name:'number', value:number }
type TUndef  = { name:'undefined', value:null }
type TBlock  = { name:'block', value:{params:string[],node:ExprNode}}

type TTypes = TSymbol|TNumber|TUndef|TBlock

type RegA1 = TTypes[]
type RegR1 = TTypes

class Frame {
    private parent? :Frame
    private userSymbols :Map<string, TTypes> = new Map()
    private registers :{
        r1 :RegR1
        a1 :RegA1}
        = { r1: {name:'undefined', value:null}, a1: [] }
    a1Set(val :RegA1) {
      this.registers.a1 = val
      return this}
    a1Get<T = RegA1>() {
      return this.registers.a1 as unknown as T}
    r1Set(val :RegR1) {
      this.registers.r1 = val
      return this}
    r1Get<T = RegR1>() {
      return this.registers.r1 as unknown as T}
    has(name :string) :boolean {
        return this.userSymbols.has(name) ||
            ((this.parent||false) && this.parent.has(name))}
    fetch<T = TTypes>(name :string) :T {
        return (this.userSymbols.has(name) ? this.userSymbols.get(name) :
            (this.parent && this.parent.fetch(name))) as T}
    update(name :string, value :TTypes) {
        this.userSymbols.set(name, value)
        return this}
    enter(frame :Frame = new Frame()) {
        const next = frame
        next.parent = this
        return frame}
    leave() {
        return this.parent ? this.parent : this}}

function evaluateProgram(node :ProgramNode, frame :Frame = new Frame()) {
    return evaluateExpr(node.value, frame)}

function evaluateExpr(node :ExprNode, frame :Frame) {
    if (node.value.name == 'term') return evaluateTerm(node.value, frame)
    return evaluateTermList(node.value, frame)}

function evaluateTerm(node :TermNode, frame :Frame) {
    if (node.value.name == 'callable') return evaluateCallable(node.value, frame)
    return evaluateScalar(node.value, frame)}

function evaluateTermList(node :TermListNode, frame :Frame) :Frame {
    const terms = node.value.map(expr => evaluateExpr(expr, frame))
    if (terms.length > 0) return terms!.pop() || frame
    return frame}

function evaluateCallable(node :CallableNode, frame :Frame) {
    if (node.value.name == 'call') return evaluateCall(node.value, frame)
    if (node.value.name == 'assignment') return evaluateAssignment(node.value, frame)
    if (node.value.name == 'flow') return evaluateFlowNode(node.value, frame)
    return evaluateOperator(node.value, frame)}

function evaluateCall(node :CallNode, frame :Frame) {
    frame = evaluateIdentifier(node.value.identifier, frame)
    const block = frame.fetch<TBlock>(frame.r1Get<TSymbol>().value)
    frame = evaluateArgs(node.value.args, frame)
    const args = frame.a1Get<TNumber[]>()
    frame = frame.enter()
    block.value.params.forEach((name, i) => {
        frame.update(name, args[i])})
    frame = evaluateExpr(block.value.node, frame)
    const returnValue = frame.r1Get()
    frame = frame.leave()
    frame.r1Set(returnValue)
    return frame}

function evaluateAssignment(node :AssignmentNode, frame :Frame) {
    if (node.value.name == 'variable') return evaluateVariable(node.value, frame)
    return evaluateFunction(node.value, frame)}

function evaluateVariable(node :VariableNode, frame :Frame) {
    frame = evaluateIdentifier(node.value.identifier, frame)
    const name = frame.r1Get<TSymbol>().value
    frame = evaluateExpr(node.value.expr, frame)
    frame.update(name, frame.r1Get())
    return frame}

function evaluateFunction(node :FunctionNode, frame :Frame) {
    frame = evaluateIdentifier(node.value.identifier, frame)
    const name = frame.r1Get<TSymbol>().value
    const params = node.value.params.map(node => {
        frame = evaluateIdentifier(node, frame)
        return frame.r1Get<TSymbol>().value
    })
    frame.update(name, {name:'block', value:{params, node:node.value.expr}})
    frame.r1Set({name:'symbol', value:name})
    return frame}

function evaluateOperator(node :OperatorNode, frame :Frame) {
    frame = evaluateArgs(node.value.args, frame)
    if (node.value.op.name == 'op-comp') {
        return evaluateOpComp(node.value.op, frame)}
    return evaluateOpMath(node.value.op, frame)}

function evaluateOpComp(node :OpCompNode, frame :Frame) {
    const [arg1, arg2] = frame.a1Get()
    const a = parseInt(`${arg1.value}`, 10)
    const b = parseInt(`${arg2.value}`, 10)
    let result :boolean
    switch(node.value) {
        case '<': result = b >= a; break
        case '>': result = b <= a; break
        case '=': result = b == a; break}
    return frame.r1Set({name:'number', value:result?1:0})}

function evaluateOpMath (node :OpMathNode, frame :Frame) {
    const [arg1, arg2] = frame.a1Get()
    const a = parseInt(`${arg1.value}`, 10)
    const b = parseInt(`${arg2.value}`, 10)
    let result :number
    switch(node.value) {
        case '+': result = a + b; break
        case '-': result = a - b; break
        case '*': result = a * b; break
        case '/': result = a / b; break}
    return frame.r1Set({name:'number', value:result})}

function evaluateArgs(node :ArgsNode, frame :Frame) {
    const args = node.value.map(arg => {
        frame = evaluateExpr(arg, frame)
        return frame.r1Get()})
    return frame.a1Set(args)}

function evaluateFlowNode(node :FlowNode, frame :Frame) {
    if (node.value.name == 'flow-if') return evaluateFlowIf(node.value, frame)
    return evaluateFlowFor(node.value, frame)}

function evaluateFlowIf(node :FlowIfNode, frame :Frame) {
    frame = evaluateExpr(node.value.cond, frame)
    const cond = !!frame.r1Get().value
    if (cond) frame = evaluateExpr(node.value.yay, frame)
    else if (node.value.nay) frame = evaluateExpr(node.value.nay, frame)
    return frame}

function evaluateFlowFor(node :FlowForNode, frame :Frame) {
    frame = evaluateIdentifier(node.value.identifier, frame)
    const name = frame.r1Get<TSymbol>().value
    frame = evaluateExpr(node.value.start, frame)
    let curr = frame.r1Get<TNumber>().value
    frame = evaluateExpr(node.value.end, frame)
    const last = frame.r1Get<TNumber>().value
    while (curr < last) {
        frame.update(name, {name:'number', value:curr})
        frame = evaluateExpr(node.value.body, frame)
        curr++}
    return frame}

function evaluateScalar(node :ScalarNode, frame :Frame) {
    let scalar = node.value
    while (scalar && scalar.name == 'identifier') {
        frame = evaluateIdentifier(scalar, frame)
        const name = frame.r1Get<TSymbol>().value
        scalar = frame.fetch(name)}
    if (scalar && scalar.name == 'digits') return evaluateDigits(scalar as DigitsNode, frame)
    return frame.r1Set({name:'undefined', value:null})}

function evaluateDigits(node :DigitsNode, frame :Frame) {
    return frame.r1Set({name:'number', value:parseInt(node.value, 10)})}

function evaluateIdentifier(node :IdentifierNode, frame :Frame) {
    return frame.r1Set({name:'symbol', value:node.value})}

