import { Line } from "./ui";
import { isPrintable, TERM } from "./term";
import { IncompleteException } from "./errors";
import { Runnable } from "./runnable";

export function lineKeyBinder(lang: Runnable, exit: () => void) {
  let line = new Line(false, false);
  line.render();
  return (key: Buffer): void => {
    const code = key.toString();
    const inserter = () => {
      if (isPrintable(code)) line.insert(code);
      else {
        // unhandled, uncomment for debugging
        // console.log({ key: code });
      }
    };
    const runner = () => {
      line.newline();
      if (line.input.text) {
        try {
          lang.run(line.input.text);
          line = new Line(false, false);
        } catch (e) {
          if (e instanceof IncompleteException) {
            line = new Line(line.prompt.isError, true);
          } else {
            line = new Line(true, line.prompt.isContinuation);
          }
        }
      } else {
        line = new Line(false, false);
      }
      line.render();
      return line;
    };
    const map = {
      [TERM.ctrlA]: () => line.moveToLineStart(),
      [TERM.ctrlD]: () => exit(),
      [TERM.ctrlE]: () => line.moveToLineEnd(),
      [TERM.ctrlK]: () => line.clearTilEnd(),
      [TERM.right]: () => line.moveRight(),
      [TERM.left]: () => line.moveLeft(),
      [TERM.backspace]: () => line.backspace(),
      [TERM.newline]: () => runner(),
      [TERM.return]: () => runner(),
      [TERM.delete]: () => {
        line.moveRight();
        line.backspace();
      },
    };
    if (map[code]) map[code]();
    else inserter();
  };
}
