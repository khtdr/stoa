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
  constructor(private klass: Class) {}
  toString() {
    return `<<${this.klass.name} instance>>`
  }
}
