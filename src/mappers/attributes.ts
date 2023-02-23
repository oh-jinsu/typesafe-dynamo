import { acceptableValueMapper } from "./acceptable";
import { extractValue } from "./extract";
import { preffix } from "./preffix";

/**
 * Map an object to the form that is acceptable for [`ExpressionAttributeNames`]
 * It affects the way to read a table.
 */
export function attributeNamesReducer() {
  return (acc: any, [key]: any) => {
    return {
      ...(acc ?? {}),
      [preffix("#")(key)]: key,
    };
  };
}

/**
 * Map an object to the form that is acceptable for [`ExpressionAttributeValues`]
 * It affects the way to read a table.
 */
export function attributeValuesReducer(toDateString: (value: Date) => string, index?: number) {
  return function reducer(acc: any, [key, value]: any): any {
    const extracted = extractValue(value);

    if (Array.isArray(extracted)) {
      return {
        ...(acc ?? {}),
        ...extracted.map((e) => [key, e]).reduce((pre, curr, i) => attributeValuesReducer(toDateString, i)(pre, curr), {}),
      };
    }

    return {
      ...(acc ?? {}),
      [preffix(":")(index === undefined ? key : `${key}_${index}`)]: acceptableValueMapper(toDateString)(extracted),
    };
  };
}
