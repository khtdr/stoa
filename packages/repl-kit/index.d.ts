declare type Runnable = {
    name: string;
    run(source: string): void;
};

declare class Repl {
    readonly lang: Runnable;
    constructor(lang: Runnable);
    spashScreen(): void;
    run(): Promise<unknown>;
}

export { Repl };
