import { acceptableValueMapper } from "./acceptable";
import { mapper } from "./map";
import { preffix } from "./preffix";

/**
 * Map an object to the form that is acceptable for [`ExpressionAttributeNames`]
 * It affects the way to read a table.
 */
export function attributeNamesMapper() {
  return mapper<string, string>(([key]) => [preffix("#")(key), key]);
}

/**
 * Map an object to the form that is acceptable for [`ExpressionAttributeValues`]
 * It affects the way to read a table.
 */
export function attributeValuesMapper(toDateString: (value: Date) => string) {
  return mapper<string, any>(([key, value]) => [preffix(":")(key), acceptableValueMapper(toDateString)(value)]);
}
