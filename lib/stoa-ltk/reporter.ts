import { Token } from ".";

type Errors = [Token, string][]

export interface Reporter {
    error(token: Token, message?: string): void
    pushSource(name: string, source: string): void
    popSource(): void
    tokenError(): void
    parseError(): void
    runtimeError(): void
    errors: false | [Token, string][]
}

export class StdErrReporter implements Reporter {
    private files: [string, string][] = []
    pushSource(name: string, source: string) {
        this.files.push([name, source])
    }
    popSource() {
        this.files.pop()
    }

    private _errors: Errors = []
    error(token: Token, message: string) {
        this._errors.push([token, message])
    }
    get errors(): false | Errors {
        return !this._errors.length ? false : this._errors
    }

    tokenError() { this.reportErrors('Syntax') }
    parseError() { this.reportErrors('Parse') }
    runtimeError() { this.reportErrors('Runtime') }
    private reportErrors(type: string) {
        const [name, source] = this.files[this.files.length - 1]
        const lines = source.split("\n")
        for (const [token, message] of this._errors) {
            this.log(`${type} error in ${name} at line,col ${token.pos.line},${token.pos.column}`)
            const prefix = `${token.pos.line}. `
            const code = `${lines[token.pos.line - 1]}`
            this.log(`${prefix}${code}`)
            const spaces = `${prefix}${code}`.replace(/./g, ' ')
            const arr = spaces.substring(0, prefix.length + token.pos.column - 1)
            this.log(`${arr}↑`)
            this.log(`${message}`)
        }
        this._errors = []
    }

    protected log(message: string) {
        console.error(message)
    }
}
