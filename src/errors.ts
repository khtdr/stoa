import { Token } from './ast'

export class Reporter {
    private _errors: [Token<any>, string][] = []
    error(token: Token<any>, message: string) {
        this._errors.push([token, message])
    }
    get errors(): false | typeof this._errors {
        return !this._errors.length ? false : this._errors
    }
}
