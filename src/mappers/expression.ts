import { MultiPuttable } from "../types/puttable";
import { preffix } from "./preffix";
import { toPuttable } from "./puttable";

export function append(str: string) {
  return (acc: string | undefined, cur: string) => {
    if (!acc) {
      return cur;
    }

    if (acc.includes(cur)) {
      return acc;
    }

    return `${acc}${str}${cur}`;
  };
}

export function expressionReducer(str: string, index?: number) {
  return function reducer(acc: string | undefined, [key, value]: any): string {
    return append(str)(
      acc,
      (() => {
        const puttable = toPuttable(value);

        if (puttable.op instanceof Function) {
          return `${puttable.op(preffix("#")(key))}`;
        }

        if (puttable instanceof MultiPuttable) {
          return `(${puttable.values.map((e) => [key, e]).reduce((pre, cur, i) => expressionReducer(` ${puttable.op} `, i)(pre, cur), "")})`;
        }

        return `${preffix("#")(key)} ${puttable.op} ${preffix(":")(index === undefined ? key : `${key}_${index}`)}`;
      })(),
    );
  };
}
