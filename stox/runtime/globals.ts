import { Token } from "../ast/nodes"
import { Interpreter } from "../interpreter"

export function registerGlobals(evaluator: Interpreter) {
    evaluator.globals.init({ text: "clock" } as Token<'IDENTIFIER'>)
    evaluator.globals.set({ text: 'clock' } as Token<'IDENTIFIER'>, {
        arity: 0, call() { return new Date().toLocaleString() }
    })
}
