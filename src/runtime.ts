import * as Ast from './ast'

export * from './runtime/environment'
export * from './runtime/globals'
export * from './runtime/values'

export class Function implements Callable {
    constructor(
        readonly arity: number,
        readonly call: (args: Result[]) => Result
    ) { }
}

export type Result = Ast.LiteralExpr['value'] | Callable
export class RuntimeError extends Error {
    constructor(readonly token: Ast.Token, message: string) {
        super(message)
    }
}

export class ReturnException { constructor(readonly value: Result = undefined) { } }
export class JumpException { constructor(public distance = 1) { } }
export class BreakException extends JumpException { }
export class ContinueException extends JumpException { }

export interface Callable { arity: number; call(args: Result[]): Result }
export function isCallable(val: Result): val is Callable {
    if (!val) return false
    return !!(val as Callable).call
}
