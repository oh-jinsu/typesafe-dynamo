import { MultiPuttable, Puttable, PuttableLike } from "../types/puttable";

export const puttable =
  (op: string) =>
  <T>(value: T) =>
    new Puttable<T>(value, op);

export const equalWith = puttable("=");

export const notEqaulWith = puttable("<>");

export const lessThan = puttable("<");

export const notGreatorThan = puttable("<=");

export const greaterThan = puttable(">");

export const notLessThan = puttable(">=");

export const or = <T>(...params: PuttableLike<T>[]) => new MultiPuttable<T>(params, "or");

export const and = <T>(...params: PuttableLike<T>[]) => new MultiPuttable<T>(params, "and");

export const exists = () => new Puttable(undefined, (x) => `attribute_exists(${x})`);

export const notExists = () => new Puttable(undefined, (x) => `attribute_not_exists(${x})`);

export const toPuttable = (value: any): any => {
  if (value instanceof Puttable) {
    if (value instanceof MultiPuttable) {
      return new MultiPuttable(value.values.map(toPuttable), value.op);
    }

    return value;
  }

  return equalWith(value);
};
