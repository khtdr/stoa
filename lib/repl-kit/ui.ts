class Prompt {
  constructor(readonly isError: boolean, readonly isContinuation: boolean) {}
  get text() {
    if (this.isContinuation) return "| ";
    return "> ";
  }
  get markup() {
    if (this.isError) return `*${this.text}`;
    return `-${this.text}`;
  }
  get width() {
    return this.markup.length;
  }
}

class Input {
  private _text = "";
  insert(text: string, at: number) {
    const [front, back] = [
      this._text.substring(0, at),
      this._text.substring(at),
    ];
    this._text = `${front}${text}${back}`;
  }
  backspace(at: number) {
    const [front, back] = [
      this._text.substring(0, at),
      this._text.substring(at),
    ];
    const chomp = front.substring(0, front.length - 1);
    this._text = `${chomp}${back}`;
  }
  clear(at: number) {
    this._text = this._text.substring(0, at);
  }
  get text() {
    return this._text;
  }
}

export class Line {
  readonly input: Input;
  readonly prompt: Prompt;
  private cursor = 0;
  constructor(isError: boolean, isContinuation: boolean) {
    this.prompt = new Prompt(isError, isContinuation);
    this.input = new Input();
  }
  render() {
    process.stdout.write("\u001B[?25l");
    this.cursor = 0;
    process.stdout.moveCursor(this.cursor, 1);
    process.stdout.cursorTo(this.cursor);
    process.stdout.write(this.prompt.markup);
    process.stdout.write(this.input.text);
    process.stdout.write("\u001B[?25h");
  }
  clearTilEnd() {
    process.stdout.write("\u001B[?25l");
    this.input.clear(this.cursor);
    process.stdout.clearScreenDown();
    process.stdout.write("\u001B[?25h");
  }
  insert(text: string) {
    process.stdout.write("\u001B[?25l");
    this.input.insert(text, this.cursor);
    process.stdout.clearLine(1);
    const appended = this.input.text.substring(this.cursor);
    process.stdout.write(appended);
    this.cursor += text.length;
    process.stdout.moveCursor(-(appended.length - text.length), 0);
    process.stdout.write("\u001B[?25h");
  }
  backspace() {
    if (this.cursor === 0) return;
    process.stdout.write("\u001B[?25l");
    this.input.backspace(this.cursor);
    this.cursor -= 1;
    process.stdout.moveCursor(-1, 0);
    process.stdout.clearLine(1);
    const remaining = this.input.text.substring(this.cursor);
    process.stdout.write(remaining);
    process.stdout.moveCursor(-remaining.length, 0);
    process.stdout.write("\u001B[?25h");
  }
  right() {
    if (this.cursor === this.input.text.length) return;
    process.stdout.write("\u001B[?25l");
    this.cursor += 1;
    process.stdout.moveCursor(1, 0);
    process.stdout.write("\u001B[?25h");
  }
  left() {
    if (this.cursor === 0) return;
    process.stdout.write("\u001B[?25l");
    this.cursor -= 1;
    process.stdout.moveCursor(-1, 0);
    process.stdout.write("\u001B[?25h");
  }
  complete() {
    process.stdout.write("\u001B[?25l");
    process.stdout.moveCursor(0, 1);
    process.stdout.cursorTo(0);
    console.log("");
    process.stdout.write("\u001B[?25h");
  }
}
