import { Repl } from './index'

class Lang {
    constructor(readonly name: string) { }
    run(source: string) { console.log(source) }
}

const repl = new Repl(new Lang('sentences'))
repl.run()
