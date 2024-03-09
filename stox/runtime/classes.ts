import { RuntimeError } from 'stoa-ltk'
import { Token } from '../ast/nodes'
import { Callable } from './control-flow'
import { Result } from './values'

export class Class implements Callable {

  constructor(readonly name: string) { }

  arity = 0
  call(_args: Result[]) {
    return new Instance(this)
  }

  toString() {
    return this.name
  }
}

export class Instance {
  private fields:Map<string, Result> = new Map()
  constructor(private klass: Class) { }
  get(name: Token<'IDENTIFIER'>) {
    if (this.fields.has(name.text)) {
      return this.fields.get(name.text)
    }
    throw new RuntimeError(name, `Undefined property [${name.text}].`)
  }
  toString() {
    return `<<${this.klass.name} instance>>`
  }
}