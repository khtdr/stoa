import { Evaluator } from "./evaluator"

export function registerGlobals(evaluator: Evaluator) {
    evaluator.globals.init("clock")
    evaluator.globals.set("clock", {
        arity: 0, call() { return new Date().toLocaleString() }
    })
}
