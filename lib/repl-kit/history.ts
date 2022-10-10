class History {
  private commands = [""];
  private pos = 0;
  update(command: string) {
    this.commands[this.pos] = command;
  }
  save() {
    this.commands.push("");
    this.pos += 1;
  }
  next() {
    return this.goto(this.pos + 1);
  }
  previous() {
    return this.goto(this.pos - 1);
  }
  private goto(n: number) {
    this.pos = Math.max(0, n);
    this.pos = Math.min(this.commands.length - 1, this.pos);
    return this.commands[this.pos];
  }
}

export const history = new History();
