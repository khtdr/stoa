import { parse, ProgramNode, ExprNode, TermListNode, TermNode, CallableNode, CallNode, AssignmentNode, VariableNode, FunctionNode, OperatorNode, ArgsNode, FlowNode, FlowIfNode, FlowForNode, DigitsNode, ScalarNode, IdentifierNode, OpMathNode, OpCompNode } from './parser'

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

function evaluateCall(_node :CallNode, frame :Frame) {
    return frame}
    //name  : 'call'
    //value :{
        //identifier :IdentifierNode
        //args   :ArgsNode}}

function evaluateAssignment(node :AssignmentNode, frame :Frame) {
    if (node.value.name == 'variable') return evaluateVariable(node.value, frame)
    return evaluateFunction(node.value, frame)}

function evaluateVariable(node :VariableNode, frame :Frame) {
    frame = evaluateIdentifier(node.value.identifier, frame)
    const name = frame.r1Get<TSymbol>().value
    frame = evaluateExpr(node.value.expr, frame)
    frame.update(name, frame.r1Get())
    return frame}

function evaluateFunction(_node :FunctionNode, frame :Frame) {
    return frame}
    //name  :'function'
    //value :{
        //identifier :IdentifierNode
        //params :IdentifierNode[]
        //expr   :ExprNode}}

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

function evaluateFlowIf(_node :FlowIfNode, frame :Frame) {
    return frame}
    //name  :'flow-if'
    //value :{
        //cond :ExprNode
        //yay  :ExprNode
        //nay  :ExprNode|void}}

function evaluateFlowFor(_node :FlowForNode, frame :Frame) {
    return frame}
    //name  :'flow-for'
    //value :{
        //identifier :IdentifierNode
        //start  :ExprNode
        //end    :ExprNode
        //body   :ExprNode}}

function evaluateScalar(node :ScalarNode, frame :Frame) {
    let scalar = node.value
    while (scalar && scalar.name == 'identifier') {
        frame = evaluateIdentifier(scalar, frame)
        const name = frame.r1Get<TSymbol>().value
        scalar = frame.fetch(name)}
    if (scalar) return evaluateDigits(scalar, frame)
    return frame.r1Set({name:'undefined', value:null})}

function evaluateDigits(node :DigitsNode, frame :Frame) {
    return frame.r1Set({name:'number', value:parseInt(node.value, 10)})}

function evaluateIdentifier(node :IdentifierNode, frame :Frame) {
    return frame.r1Set({name:'symbol', value:node.value})}




export function evaluate(node :ReturnType<typeof parse>) {
    if (!node) return
    switch(node.name) {
        case 'program': return evaluateProgram(node).r1Get().value}}



type TSymbol = { name:'symbol', value:string }
type TNumber = { name:'number', value:number }
type TUndef  = { name:'undefined', value:null }

type RegA1 = (TSymbol|TNumber|TUndef)[]
type RegR1 = TSymbol|TNumber|TUndef

class Frame {
    private parent? :Frame
    private userSymbols :Map<string, TSymbol|TNumber|TUndef> = new Map()
    private registers :{
        r1 :RegR1
        a1 :RegA1}
        = { r1: {name:'undefined', value:null}, a1: [] }
    a1Set(val :RegA1) {
      this.registers.a1 = val
      return this}
    a1Get() {
      return this.registers.a1}
    r1Set(val :RegR1) {
      this.registers.r1 = val
      return this}
    r1Get<T = RegR1>() {
      return this.registers.r1 as unknown as T}
    has(name :string) :boolean {
        return this.userSymbols.has(name) ||
            ((this.parent||false) && this.parent.has(name))}
    fetch<T = TSymbol|TNumber|TUndef>(name :string) :T {
        return (this.userSymbols.has(name) ? this.userSymbols.get(name) :
            (this.parent && this.parent.fetch(name))) as T}
    update(name :string, value :TSymbol|TNumber|TUndef) {
        this.userSymbols.set(name, value)
        return this}
    enter(frame :Frame = new Frame()) {
        const next = frame
        next.parent = this}
    leave() {
        return this.parent}}
