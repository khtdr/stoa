import { Token } from ".";

export interface Reporter {
    error(token: Token, message?: string): void;
}

export class StdReporter implements Reporter {
    error(token: Token, message?: string) {
        const str = message ?? token.toString();
        console.error(str);
    }
}
