import { mapper } from "./map";

/**
 * Map a value to the form that is acceptable for [`DynamoDB.DocumentClient`]
 */
export function acceptableValueMapper(toDateString: (value: Date) => string) {
  return (value: any): any => {
    if (value === null || typeof value === "undefined") {
      return null;
    }

    if (value instanceof Date) {
      return toDateString(value);
    }

    if (value.constructor === Object) {
      return `Object ${JSON.stringify(value)}`;
    }

    return value;
  };
}

/**
 * Map an object to the form that is acceptable for [`DynamoDB.DocumentClient`]
 * It affects the way to write a data in table.
 */
export function acceptableObjectMapper(toDateString: (value: Date) => string) {
  return mapper(([key, value]) => [key, acceptableValueMapper(toDateString)(value)]);
}
