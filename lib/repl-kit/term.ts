export const TERM = {
  hideCursor: "\u001B[?25l",
  showCursor: "\u001B[?25h",
  ctrlA: "\x01",
  ctrlC: "\x03",
  ctrlD: "\x04",
  ctrlE: "\x05",
  ctrlK: "\x0B",
  up: "\x1B[A",
  down: "\x1B[B",
  right: "\x1B[C",
  left: "\x1B[D",
  backspace: "\x7F",
  delete: "\x1B[3~",
  newline: "\n",
  return: "\r",

  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

export const isPrintable = (key: string) =>
  !key.match(/[\p{Cc}\p{Cn}\p{Cs}]+/gu);

export const isUnprintable = (key: string) => !isPrintable(key);
