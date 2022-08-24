export type Runnable = {
  name: string;
  run(source: string): void;
};
