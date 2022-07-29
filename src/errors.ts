import { Token } from './ast'

export class Reporter {
    private _errors: [Token, string][] = []
    error(token: Token, message: string) {
        this._errors.push([token, message])
    }
    get errors(): false | typeof this._errors {
        return !this._errors.length ? false : this._errors
    }
    private fileName = ''
    private source = ''
    addSource(name: string, source: string) {
        this.fileName = name
        this.source = source
    }
    parseError() { this.report('Parse') }
    runtimeError() { this.report('Runtime') }
    private report(type: string) {
        const lines = this.source.split("\n")
        for (const [token, message] of this._errors) {
            console.log(`${type} error in ${this.fileName} at line,col ${token.pos.line},${token.pos.column}`)
            const prefix = `${token.pos.line}. `
            const code = `${lines[token.pos.line - 1]}`
            console.log(`${prefix}${code}`)
            const spaces = `${prefix}${code}`.replace(/./g, ' ')
            const arr = spaces.substring(0, prefix.length + token.pos.column - 1)
            console.log(`${arr}↑`)
            console.log(`${message}`)
        }
    }
}
