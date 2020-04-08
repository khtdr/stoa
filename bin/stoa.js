var __makeTemplateObject = (undefined && undefined.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (undefined && undefined.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
//@ts-ignore
var readline_ui_1 = __importDefault(require("readline-ui"));
var chalk_1 = __importDefault(require("chalk"));
var opts = __importStar(require("opts"));
var fs_1 = require("fs");
var package_json_1 = require("../package.json");
var lexer_1 = require("./lexer");
var tokenizer_1 = require("./tokenizer");
var scanner_1 = require("./scanner");
var parser_1 = require("./parser");
var interpreter_1 = require("./interpreter");
opts.parse([
    { long: 'version', short: 'v',
        description: 'Displays the version and exits' },
    { long: 'tokenize', short: 't',
        description: 'Emits the list of tokens (JSON)' },
    { long: 'parse', short: 'p',
        description: 'Emits the parse tree (CST/JSON)' },
    { long: 'repl', short: 'r',
        description: 'Launch a colorful REPL' },
], [
    { name: 'file' },
], true);
if (opts.get('version')) {
    console.log('stoa', package_json_1.version);
    process.exit();
}
if (opts.arg('file')) {
    runFile("" + opts.arg('file'));
    process.exit();
}
if (opts.get('repl')) {
    runRepl();
}
else {
    runPipe();
}
function runFile(fileName) {
    var program = fs_1.readFileSync(fileName).toString();
    var output = runText(program)[0];
    console.log(JSON.stringify(output, null, 3));
}
function runText(program, frame) {
    var lexemes = lexer_1.lex(program);
    var tokens = tokenizer_1.tokenize(lexemes);
    if (opts.get('tokenize'))
        return [tokens, frame];
    var scanner = scanner_1.scan(tokens);
    var ast = parser_1.parse(scanner);
    if (opts.get('parse'))
        return [ast, frame];
    return interpreter_1.evaluate(ast, frame);
}
function runRepl() {
    console.log(chalk_1["default"](templateObject_1 || (templateObject_1 = __makeTemplateObject(["{red \u2554\u2550\u2557\u2554\u2566\u2557\u2554\u2550\u2557\u2554\u2550\u2557}  {gray \u252C\u2500\u2510\u250C\u2500\u2510\u250C\u2500\u2510\u252C  }"], ["{red \u2554\u2550\u2557\u2554\u2566\u2557\u2554\u2550\u2557\u2554\u2550\u2557}  {gray \u252C\u2500\u2510\u250C\u2500\u2510\u250C\u2500\u2510\u252C  }"]))));
    console.log(chalk_1["default"](templateObject_2 || (templateObject_2 = __makeTemplateObject(["{red \u255A\u2550\u2557 \u2551 \u2551 \u2551\u2560\u2550\u2563}  {gray \u2502 \u2502\u251C\u2524 \u2502 \u2502\u2502  }"], ["{red \u255A\u2550\u2557 \u2551 \u2551 \u2551\u2560\u2550\u2563}  {gray \u2502 \u2502\u251C\u2524 \u2502 \u2502\u2502  }"]))));
    console.log(chalk_1["default"](templateObject_3 || (templateObject_3 = __makeTemplateObject(["{red \u255A\u2550\u255D \u2569 \u255A\u2550\u255D\u2569 \u2569}  {gray \u251C\u252C\u2518\u2502  \u251C\u2500\u2518\u2502  }"], ["{red \u255A\u2550\u255D \u2569 \u255A\u2550\u255D\u2569 \u2569}  {gray \u251C\u252C\u2518\u2502  \u251C\u2500\u2518\u2502  }"]))));
    console.log(chalk_1["default"](templateObject_4 || (templateObject_4 = __makeTemplateObject(["\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 - {gray \u2534\u2514\u2500\u2514\u2500\u2518\u2534  \u2534\u2500\u2518}"], ["\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 - {gray \u2534\u2514\u2500\u2514\u2500\u2518\u2534  \u2534\u2500\u2518}"]))));
    console.log(chalk_1["default"](templateObject_5 || (templateObject_5 = __makeTemplateObject(["{gray version:} v", ""], ["{gray version:} v", ""])), package_json_1.version));
    console.log(chalk_1["default"](templateObject_6 || (templateObject_6 = __makeTemplateObject(["{gray to exit:} ctrl+d"], ["{gray to exit:} ctrl+d"]))));
    var ui = new readline_ui_1["default"]();
    var prompt = chalk_1["default"](templateObject_7 || (templateObject_7 = __makeTemplateObject(["{blue ?>} "], ["{blue ?>} "])));
    ui.render(prompt);
    var frame = new interpreter_1.Frame();
    ui.on('keypress', function () {
        ui.render(prompt + ui.rl.line);
    });
    ui.on('line', function (line) {
        ui.render(prompt + line);
        ui.end();
        ui.rl.pause();
        try {
            if (line == ';; > quit') {
                process.exit();
            }
            var result = runText(line, frame);
            frame = result[1];
            console.log(chalk_1["default"](templateObject_8 || (templateObject_8 = __makeTemplateObject(["{gray >>} ", ""], ["{gray >>} ", ""])), JSON.stringify(result[0], null, 3)));
        }
        catch (e) {
            console.log(e);
        }
        ui.rl.resume();
        ui.render(prompt);
    });
}
function runPipe() {
    var program = fs_1.readFileSync('/dev/stdin').toString();
    var lexemes = lexer_1.lex(program);
    var tokens = tokenizer_1.tokenize(lexemes);
    var scanner = scanner_1.scan(tokens);
    var ast = parser_1.parse(scanner);
    var output = interpreter_1.evaluate(ast);
    console.log(JSON.stringify(output[0]));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
