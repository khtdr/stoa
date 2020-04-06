//@ts-ignore
import UI from 'readline-ui'
import chalk from 'chalk'
import * as opts from 'opts'
import { readFileSync } from 'fs'
import { version } from '../package.json'
import { lex } from './lexer'
import { tokenize } from './tokenizer'
import { scan } from './scanner'
import { parse } from './parser'
import { evaluate, Frame } from './interpreter'


opts.parse([
    { long: 'version' },
    { long: 'tokenize'},
    { long: 'parse'   },
], [
    { name: 'file'    },
], true)


if (opts.arg('version')) {
    console.log('stoa', version)
    process.exit()}

if (opts.arg('file')) {
    runFile(`${opts.arg('file')}`)
    process.exit()}

else {runRepl()}

function runFile(fileName :string) {
    const program = readFileSync(fileName).toString()
    const output = runText(program)[0]
    console.log(JSON.stringify(output, null, 3))
}

function runText(program :string, frame? :Frame) :[any, Frame|undefined] {
    const lexemes = lex(program)
    const tokens  = tokenize(lexemes)
    if (opts.get('tokenize')) return [tokens, frame]

    const scanner = scan(tokens)
    const ast     = parse(scanner)
    if (opts.get('parse')) return [ast, frame]

    return evaluate(ast, frame)
}


function runRepl() {
    console.log(chalk`welcome to the {gray ┬─┐┌─┐┌─┐┬}`)
    console.log(chalk` {red ╔═╗╔╦╗╔═╗╔═╗}  {gray │ │├┤ │ ││}`)
    console.log(chalk` {red ╚═╗ ║ ║ ║╠═╣}  {gray ├┬┘│  ├─┘│}`)
    console.log(chalk` {red ╚═╝ ╩ ╚═╝╩ ╩}  {gray ┴└─└─┘┴  ┴─┘}`)
    console.log(chalk`⫶⫶⫶⫶⫶⫶⫶⫶⫶⫶{gray version:} ${version} ⫶⫶`)
    const ui = new UI()
    const prompt = chalk`{blue ?>} `
    ui.render(prompt);

    let frame :Frame|undefined = new Frame()
    ui.on('keypress', () => {
        ui.render(prompt + ui.rl.line)
    })
    ui.on('line', (line :string) => {
        ui.render(prompt + line)
        ui.end()
        ui.rl.pause()
        const result = runText(line, frame)
        frame = result[1]
        console.log(chalk`{gray >>} ${JSON.stringify(result[0], null, 3)}`)
        ui.rl.resume()
        ui.render(prompt)
    })
}
