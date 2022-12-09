import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { DateColumnList } from "../types/date_column_list";
import { MockReducer, ReducerSlice } from "../types/reducer";

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

export type MockValuesReducer<Schema> = MockReducer<ValuesReducer<Schema>, "values">;

export function mockValuesReducer<Schema>(...[params]: Parameters<MockValuesReducer<Schema>>): ReturnType<MockValuesReducer<Schema>> {
  return ({ values }) => ({
    values: {
      ...(values ?? {}),
      ...params,
    },
  });
}
