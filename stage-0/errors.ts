import { Token } from './tokenizer'

export class UnrecognizedInput {
    constructor(
        readonly token :Token
    ) {}
}
