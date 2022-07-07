import { Language, CliRunner } from './lib'
import { LoxScanner, LoxParser } from './ast-builder'
import { LoxEvaluator } from './runtime'
import { LoxPrettyPrinter } from './pretty-print'
import { name, author, version, description, repository, license } from '../package.json'

const Lox = new Language(
    { name, version, author, description, repository, license },
    {
        Tokenizer: LoxScanner,
        Parser: LoxParser,
        PrettyPrinter: LoxPrettyPrinter,
        Evaluator: LoxEvaluator,
    }
)

new CliRunner(Lox).run()
