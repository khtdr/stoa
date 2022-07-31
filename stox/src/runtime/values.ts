import { LiteralExpr } from '../ast/expressions'
import { Callable } from './control-flow'

export type Result = LiteralExpr['value'] | Callable

export function isNumber(val: unknown): val is [number, number] {
    return Array.isArray(val) && val.length == 2
}

export function isString(val: unknown): val is string {
    return typeof val == 'string'
}

export function truthy(val: unknown) {
    if (val === false) return false
    if (val === undefined) return false
    return true
}
