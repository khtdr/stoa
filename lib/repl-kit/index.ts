export class Repl {
    constructor(readonly lang: any) { }
    async run() {
        return new Promise(resolve => resolve(undefined))
    }
}
