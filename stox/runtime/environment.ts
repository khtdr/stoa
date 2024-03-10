import { RuntimeError } from 'stoa-ltk/runtime'
import { Token } from '../ast/nodes'

export class Environment {
    constructor(readonly enclosure?: Environment) { }
    private table = new Map<string, any>()
    has(name: Pick<Token<'IDENTIFIER'>, 'text'>): boolean {
        return this.table.has(name.text) || !!this.enclosure?.has(name)
    }
    init(name: Pick<Token<'IDENTIFIER'>, 'text'>) {
        if (!this.table.has(name.text)) this.table.set(name.text, undefined)
    }
    set(name: Pick<Token<'IDENTIFIER'>, 'text'>, value: any, distance = 0): void {
        if (distance > 0 && this.enclosure) return this.enclosure.set(name, value, distance - 1)
        if (this.table.has(name.text)) this.table.set(name.text, value)
        else if (this.enclosure?.has(name)) this.enclosure.set(name, value)
        else throw new RuntimeError(name, `No such variable: ${name.text}`)
    }
    get<T = any>(name: Pick<Token<'IDENTIFIER'>, 'text'>, distance = 0): T {
        if (distance > 0 && this.enclosure) return this.enclosure.get(name, distance - 1)
        if (this.table.has(name.text)) return this.table.get(name.text)
        if (this.enclosure?.has(name)) return this.enclosure.get(name)
        throw new RuntimeError(name, `Undefined variable: ${name.text}`)
    }
}
