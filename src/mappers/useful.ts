import { toCamelCase } from "./case";
import { mapper } from "./map";

/**
 * Map a value to the form that is useful for user.
 */
export function usefulValueMapper(fromDateString: (value: string) => Date) {
  return (value: unknown): any => {
    if (typeof value === "string" && value.includes("T")) {
      if (!Number.isNaN(Date.parse(value))) {
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
