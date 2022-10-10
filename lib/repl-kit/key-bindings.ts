import { Line } from "./ui";
import { isPrintable, TERM } from "./term";
import { IncompleteException } from "./errors";
import { Runnable } from "./runnable";
import { history } from "./history";

export function lineKeyBinder(lang: Runnable, exit: () => void) {
  let multiLineBuffer: string[] = [];
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
      if (line.input.text || line.prompt.isContinuation) {
        try {
          let command = line.input.text;
          if (line.prompt.isContinuation)
            command = [...multiLineBuffer, command].join("\n");
          lang.run(command);
          line = new Line(false, false);
          history.save();
          multiLineBuffer = [];
        } catch (e) {
          if (e instanceof IncompleteException) {
            multiLineBuffer.push(line.input.text);
            line = new Line(line.prompt.isError, true);
          } else {
            line = new Line(true, line.prompt.isContinuation);
          }
        }
      } else {
        line = new Line(false, false);
      }
      return line;
    };
    const map = {
      [TERM.ctrlA]: () => line.moveToLineStart(),
      [TERM.ctrlC]: () => {
        line.newline();
        line.moveToLineStart();
        line.clearTilEnd();
        line.render();
      },
      [TERM.ctrlD]: () => exit(),
      [TERM.ctrlE]: () => line.moveToLineEnd(),
      [TERM.ctrlK]: () => line.clearTilEnd(),
      [TERM.up]: () => {
        line.moveToLineStart();
        line.clearTilEnd();
        line.insert(history.previous());
      },
      [TERM.down]: () => {
        line.moveToLineStart();
        line.clearTilEnd();
        line.insert(history.next());
      },
      [TERM.right]: () => line.moveRight(),
      [TERM.left]: () => line.moveLeft(),
      [TERM.backspace]: () => line.backspace(),
      [TERM.return]: () => {
        line.newline();
        runner();
        line.render();
      },
      [TERM.delete]: () => {
        line.moveRight();
        line.backspace();
      },
    };

    line.hideCursor();
    if (map[code]) map[code]();
    else inserter();
    line.showCursor();
    history.update(line.input.text.trim());
  };
}
