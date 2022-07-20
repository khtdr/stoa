import { name, author, version, description, repository, license } from '../package.json'
import { Language, CliDriver } from './lib'
import { Scanner } from './scanner'
import { Parser } from './parser'
import { Printer } from './printer'
import { Evaluator } from './evaluator'

const StoaLang = new Language(
    { name, version, author, description, repository, license },
    { Scanner, Parser }
)

new CliDriver(StoaLang, { Printer, Evaluator }).run()
