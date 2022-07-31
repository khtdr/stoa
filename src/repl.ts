import * as Ltk from "stoa-ltk";
export class Repl {
  constructor(readonly lang: Ltk.Language<any, any, any>) { }
  async run() { }
}

// @ ts-expect-error this project kinda sucks like this
// import { AutoComplete } from 'enquirer'
// import * as Lib from "./lib";
// import UI from 'readline-ui'
// import chalk from 'chalk'
// import { Driver } from "."

// export class Repl {
//   constructor(readonly lang: Lib.Language<any, any, any>) { }
//   async run() {
//     const prompt = new AutoComplete({
//       name: 'flavor',
//       message: 'Pick your favorite flavor',
//       limit: 10,
//       initial: 2,
//       choices: [
//         'Almond',
//         'Apple',
//         'Banana',
//         'Blackberry',
//         'Blueberry',
//         'Cherry',
//         'Chocolate',
//         'Cinnamon',
//         'Coconut',
//         'Cranberry',
//         'Grape',
//         'Nougat',
//         'Orange',
//         'Pear',
//         'Pineapple',
//         'Raspberry',
//         'Strawberry',
//         'Vanilla',
//         'Watermelon',
//         'Wintergreen'
//       ]
//     });

//     return prompt.run()
//   }
//   async run2() {
//     console.log("in the repl");

//     var stdin = process.stdin;
//     stdin.setRawMode(true);
//     stdin.setEncoding("utf8");

//     let line = "";

//     return new Promise((resolve) => {
//       stdin.on("data", (key) => {
//         // console.log({ key });
//         if (["\x1A", "\x03", "\x04"].includes(key.toString())) {
//           // CTRL-c, CTRL-d
//           stdin.destroy();
//           resolve(undefined);
//         }
//         if (!key.toString().match(/[\p{Cc}\p{Cn}\p{Cs}]+/gu)) {
//           line += key.toString();
//           process.stdout.write(key);
//         }
//         if (["\x7F"].includes(key.toString())) {
//           line = line.substring(0, line.length - 2);
//           // process.stdout.clearLine(0);
//           // process.stdout.write(line);
//           process.stdout.write("\x08");
//         }
//         if (["\r", "\n"].includes(key.toString())) {
//           console.log("running line:", line);
//           this.lang.run("repl", line);
//           line = "";
//         }
//       });
//     });
//   }
// }

// function red(strings: TemplateStringsArray) {
//     return `\x1b[31m${strings.join('')}\x1b[0m`
// }
// function blue(strings: TemplateStringsArray) {
//     return `\x1b[34m${strings.join('')}\x1b[0m`
// }
// function green(strings: TemplateStringsArray) {
//     return `\x1b[32m${strings.join('')}\x1b[0m`
// }
