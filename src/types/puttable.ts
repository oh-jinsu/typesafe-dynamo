export type KeyFunction = (key: string) => string;

export type PuttableOperator = KeyFunction | string;

export class Puttable<T = any> {
  readonly op: PuttableOperator;
  readonly value: T;

  constructor(value: T, op?: PuttableOperator) {
    this.value = value;

    this.op = op ?? "=";
  }
}

export class MultiPuttable<T = any> extends Puttable<T> {
  readonly values: PuttableLike<T>[];

  constructor(value: PuttableLike<T>[], op?: PuttableOperator) {
    super(undefined as any, op);

    this.values = value;
  }
}

export type PuttableLike<T> = Puttable<T> | T;

export type PuttableRecordOf<T> = {
  [K in keyof T]: PuttableLike<T[K]>;
};
