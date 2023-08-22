import { MultiPuttable } from "../types/puttable";
import { acceptableValueMapper } from "./acceptable";
import { preffix } from "./preffix";
import { toPuttable } from "./puttable";

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
export function attributeValuesReducer(toDate: (value: Date) => string, index?: number) {
  return function reducer(acc: any, [key, value]: any): any {
    const puttable = toPuttable(value);

    if (puttable.op instanceof Function) {
      return acc;
    }

    if (puttable instanceof MultiPuttable) {
      return {
        ...(acc ?? {}),
        ...puttable.values.map((e) => [key, e]).reduce((pre, curr, i) => attributeValuesReducer(toDate, i)(pre, curr), {}),
      };
    }

    return {
      ...(acc ?? {}),
      [preffix(":")(index === undefined ? key : `${key}_${index}`)]: acceptableValueMapper(toDate)(puttable.value),
    };
  };
}
