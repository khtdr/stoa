declare class Repl {
    readonly lang: any;
    constructor(lang: any);
    prompt_width: number;
    prompt(): void;
    run(): Promise<unknown>;
}

export { Repl };
