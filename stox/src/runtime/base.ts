import { LiteralExpr } from '../ast/expressions'
import { Token } from '../ast/index'
import { Callable } from './control-flow'

export type Result = LiteralExpr['value'] | Callable
export class RuntimeError extends Error {
    constructor(readonly token: Token, message: string) {
        super(message)
    }
}
