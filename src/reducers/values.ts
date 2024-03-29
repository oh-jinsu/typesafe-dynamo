import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDate: (value: Date) => any;
};

export type ValuesReducer<Schema> = (params: Schema) => ReducerSlice<DynamoDB.PutItemInput, "Item">;

/**
 * Pass values incuding the partion key of the entity.
 * It automatically adds `updated_at` and `created_at` properties.
 *
 * ## Example
 * ```
 * await user.put(({ values }) => [
 *   values({
 *     id: 1,
 *     name: "jinsu",
 *   }),
 * ]);
 *
 * ```
 */
export function valuesConstructor<Schema>({ toDate }: Context): ValuesReducer<Schema> {
  return (params) =>
    ({ Item }) => ({
      Item: {
        ...(Item ?? {}),
        ...acceptableObjectMapper(toDate)({
          ...params,
        }),
      },
    });
}
