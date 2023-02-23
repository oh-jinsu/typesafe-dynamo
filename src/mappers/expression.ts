import { extractValueOperator } from "./extract";
import { preffix } from "./preffix";

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
        if (value instanceof Function) {
          return `${value(preffix("#")(key))}`;
        }

        if (Array.isArray(value)) {
          return `(${value.map((e) => [key, e]).reduce((pre, cur, i) => expressionReducer(" or ", i)(pre, cur), "")})`;
        }

        return `${preffix("#")(key)} ${extractValueOperator(value)} ${preffix(":")(index === undefined ? key : `${key}_${index}`)}`;
      })(),
    );
  };
}
