declare class Repl {
    readonly lang: any;
    constructor(lang: any);
    run(): Promise<unknown>;
}

export { Repl };
