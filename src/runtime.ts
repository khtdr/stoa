// SKIPPED OVER
// - Runtime errors
// - Error handling in general
import * as Ast from './ast'

export class Environment {
    constructor(readonly enclosure?: Environment) { }
    private table = new Map<string, any>()
    has(name: string): boolean {
        return this.table.has(name) || !!this.enclosure?.has(name)
    }
    init(name: string) {
        if (!this.table.has(name)) this.table.set(name, undefined)
        else throw new RuntimeError(`Variable already defined: ${name}`)
    }
    set(name: string, value: any): void {
        if (this.table.has(name)) this.table.set(name, value)
        else if (this.enclosure?.has(name)) this.enclosure.set(name, value)
        else throw new RuntimeError(`No such variable: ${name}`)
    }
    get<T = any>(name: string): T {
        if (this.table.has(name)) return this.table.get(name)
        if (this.enclosure?.has(name)) return this.enclosure.get(name)
        throw new RuntimeError(`Undefined variable: ${name}`)
    }
}

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

export class Function implements Callable {
    constructor(
        readonly arity: number,
        readonly call: (args: Result[]) => Result
    ) { }
}

export type Result = Ast.LiteralExpr['value'] | Callable
export class RuntimeError extends Error { }
export class ReturnException extends Error { value: Result = undefined }
export class JumpException extends Error { distance = 1 }
export class BreakException extends JumpException { }
export class ContinueException extends JumpException { }
export interface Callable { arity: number; call(args: Result[]): Result }
export function isCallable(val: Result): val is Callable {
    if (!val) return false
    return !!(val as Callable).call
}
