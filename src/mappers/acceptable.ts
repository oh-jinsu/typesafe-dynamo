import { mapper } from "./map";

/**
 * Map a value to the form that is acceptable for [`DynamoDB.DocumentClient`]
 */
export function acceptableValueMapper<DateFormat>(toDate: (value: Date) => DateFormat) {
  return (value: any): any => {
    if (value === null || typeof value === "undefined") {
      return null;
    }

    if (value instanceof Date) {
      return toDate(value);
    }

    if (value.constructor === Object) {
      return acceptableObjectMapper(toDate)(value);
    }

    return value;
  };
}

/**
 * Map an object to the form that is acceptable for [`DynamoDB.DocumentClient`]
 * It affects the way to write a data in table.
 */
export function acceptableObjectMapper<DateFormat>(toDate: (value: Date) => DateFormat) {
  return mapper(([key, value]) => [key, acceptableValueMapper(toDate)(value)]);
}
