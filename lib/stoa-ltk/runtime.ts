import { Token } from "./tokenizer";

export class RuntimeError extends Error {
    constructor(readonly token: Partial<Token>, message: string) {
        super(message)
    }
}
