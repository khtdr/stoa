import { Interpreter } from "./interpreter"

export function registerGlobals(evaluator: Interpreter) {
    evaluator.globals.init("clock")
    evaluator.globals.set("clock", {
        arity: 0, call() { return new Date().toLocaleString() }
    })
}
