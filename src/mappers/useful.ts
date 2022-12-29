import { toCamelCase } from "./case";
import { mapper } from "./map";

/**
 * Map a value to the form that is useful for user.
 */
export function usefulValueMapper(fromDateString: (value: string) => Date) {
  return function recursion(value: unknown): any {
    if (typeof value === "string") {
      if (/^Object {(.|\n|\r)*}$/.test(value)) {
        return usefulObjectMapper(fromDateString)(JSON.parse(value.replace("Object ", "")));
      }

      if (/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/.test(value)) {
        return fromDateString(value);
      }
    }

    return value;
  };
}

/**
 * Map an object to the form that is useful for user.
 */
export function usefulObjectMapper(fromDateString: (value: string) => Date) {
  return mapper(([key, value]) => [toCamelCase(key), usefulValueMapper(fromDateString)(value)]);
}
