import { Interpreter } from "./interpreter"
import { Token } from "./ast"

export function registerGlobals(evaluator: Interpreter) {
    evaluator.globals.init({ text: "clock" } as Token<'IDENTIFIER'>)
    evaluator.globals.set({ text: 'clock' } as Token<'IDENTIFIER'>, {
        arity: 0, call() { return new Date().toLocaleString() }
    })
}
