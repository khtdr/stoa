export const repl = undefined
// import UI from 'readline-ui'
// import chalk from 'chalk'
// import { Driver } from "."


// export class Repl {
//     constructor(
//         readonly driver: Driver<any, any>
//     ) { }

//     async run(tokenize = false) {
//         return new Promise(resolve => {
//             const ui = new UI()
//             const prompt = chalk`{blue ?>} `
//             ui.render(prompt)
//             ui.on("keypress", () => ui.render(prompt + ui.rl.line))
//             ui.on("line", (line: string) => {
//                 ui.render(prompt + line);
//                 ui.end();
//                 ui.rl.pause();
//                 if (line == ".quit.") return resolve(undefined)

//                 const out = this.driver.run(line);
//                 const value = tokenize ? out.tokens.join("\n") : out.result;
//                 console.log(chalk`{gray >>} ${value}`);
//                 ui.rl.resume();
//                 ui.render(prompt);
//             });
//         })
//     }
// }
