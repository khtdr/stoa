import { Expression } from 'stox/ast/nodes'
import { Instance } from './classes'
import { Environment } from './environment'
import { Result } from './values'

export class ReturnException {
    constructor(readonly value: Result = undefined) { }
}
export class JumpException {
    constructor(public distance = 1) { }
}
export class BreakException extends JumpException { }
export class ContinueException extends JumpException { }

export interface Callable {
    arity: number
    call(args: Result[]): Result
}
export function isCallable(val: Result): val is Callable {
    if (!val) return false
    return !!(val as Callable).call
}

export class Function implements Callable {
    constructor(
        readonly expr: Expression
        readonly arity: number,
        readonly closure: Environment,
        readonly call: (args: Result[]) => Result
    ) { }
    bind(instance: Instance) {
        const env = new Environment(this.closure)
        env.set({ text: 'this' }, instance)
    }
}

export class Function implements Callable {
    constructor(
        readonly arity: number,
        readonly closure: Environment,
        readonly call: (args: Result[]) => Result
    ) { }
    bind(instance: Instance) {
        const env = new Environment(this.closure)
        env.set({ text: 'this' }, instance)
    }
}
