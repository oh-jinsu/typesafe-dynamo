import { toCamelCase } from "./case";
import { mapper } from "./map";

/**
 * Map a value to the form that is useful for user.
 */
export function usefulValueMapper<DateFormat>(fromDate: (value: DateFormat) => Date, validateDate: (value: unknown) => boolean) {
  return function recursion(value: unknown): any {
    if (validateDate(value)) {
      return fromDate(value as DateFormat);
    }

    if ((value as any)?.constructor === Object) {
      return usefulObjectMapper(fromDate, validateDate)(value);
    }

    return value;
  };
}

/**
 * Map an object to the form that is useful for user.
 */
export function usefulObjectMapper<DateFormat>(fromDate: (value: DateFormat) => Date, validateDate: (value: unknown) => boolean) {
  return mapper(([key, value]) => [toCamelCase(key), usefulValueMapper(fromDate, validateDate)(value)]);
}
