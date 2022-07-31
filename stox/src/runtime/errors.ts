import { Token } from "../tokenizer";

export class RuntimeError extends Error {
    constructor(readonly token: Token, message: string) {
        super(message)
    }
}
