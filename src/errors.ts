import { Token } from './ast'

export class Reporter {
    private _errors: [Token, string][] = []
    error(token: Token, message: string) {
        this._errors.push([token, message])
    }
    get errors(): false | typeof this._errors {
        return !this._errors.length ? false : this._errors
    }
}
