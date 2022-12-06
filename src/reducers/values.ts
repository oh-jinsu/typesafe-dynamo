import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { DateColumnList } from "../types/date_column_list";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type ValuesReducer<Schema> = (params: Omit<Schema, DateColumnList>) => ReducerSlice<DynamoDB.PutItemInput, "Item">;

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
export function valuesConstructor<Schema>({ toDateString }: Context) {
  return (params: Omit<Schema, DateColumnList>): ReducerSlice<DynamoDB.PutItemInput, "Item"> =>
    ({ Item }) => ({
      Item: {
        ...(Item ?? {}),
        ...acceptableObjectMapper(toDateString)({
          ...params,
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      },
    });
}
