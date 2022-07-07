/// <reference path="./deps.d.ts" />
import UI from 'readline-ui'
import chalk from 'chalk'
import { Driver } from "."


export class Repl {
    constructor(
        readonly driver: Driver<any, any>
    ) { }

    async run() {
        return new Promise(resolve => {
            const ui = new UI()
            const prompt = chalk`{blue ?>} `
            ui.render(prompt)
            ui.on("keypress", () => ui.render(prompt + ui.rl.line))
            ui.on("line", (line: string) => {
                ui.render(prompt + line);
                ui.end();
                ui.rl.pause();
                console.log(line)
                if (line == ".quit.") return resolve(undefined)

                const value = this.driver.run(line);
                console.log(chalk`{gray >>} ${value}`);
                ui.rl.resume();
                ui.render(prompt);
            });
        })
    }
}
