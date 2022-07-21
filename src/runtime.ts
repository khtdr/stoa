// SKIPPED OVER
// - Runtime errors
// - Error handling in general

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

export function lit(val: unknown): string {
    if (val === undefined) return "nil"
    return `${val}`
}

export function truthy(val: unknown) {
    if (val === false) return false
    if (val === undefined) return false
    return true
}

export function number(val: unknown) {
    if (typeof val == 'number') return val
    return parseFloat(`${val}`)
}

export class RuntimeError extends Error { }
export class JumpException extends Error { distance = 1 }
export class BreakException extends JumpException { }
export class ContinueException extends JumpException { }
