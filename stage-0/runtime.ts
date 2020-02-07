import { Ast } from './parser'

export class Runtime {
    constructor (readonly ast? :Ast) {}

    evaluate() {
        return JSON.stringify(this.ast, null, 2)
    }
}
