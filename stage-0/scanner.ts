import { Token, Position } from './tokenizer'
import { lexicon } from './lexer'

export class Scanner {

    private i = 0
    constructor (readonly tokens :Token[]) {}

    checkpoint() {
        const revert = this.i
        return () => {this.i = revert}}

    peek<K extends keyof typeof lexicon>(name :K) {
        const token = this.tokens[this.i]
        if (token && token.name == name) {
            const proto = lexicon[name]
            return token as (typeof proto) & Position}}

    one<K extends keyof typeof lexicon>(name :K) {
        const token = this.peek(name)
        if (token) {
            this.i++
            return token}}}


export function scan(tokens :Token[]) {
    return new Scanner(tokens)}
