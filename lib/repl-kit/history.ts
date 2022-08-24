export class History {
  private commands: string[] = [];
  private pos = 0;
  push(command: string) {
    this.commands.push(command);
    this.pos = 0;
  }
  forward() {
    this.pos = Math.min(this.commands.length, this.pos + 1);
    return this.commands[this.pos] ?? "";
  }
  back() {
    this.pos = Math.max(0, this.pos - 1);
    return this.commands[this.pos];
  }
}
