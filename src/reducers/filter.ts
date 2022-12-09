import { DynamoDB } from "aws-sdk";
import { attributeNamesMapper, attributeValuesMapper } from "../mappers/attributes";
import { preffix } from "../mappers/preffix";
import { MockReducer, ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type FilterReducer<Schema, PK extends keyof Schema> = (
  params: Partial<Omit<Schema, PK>>,
) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "FilterExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues">;

/**
 * Filter results with conditions.
 * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
 *
 * ## Example
 * ```
 * const result = await user.scan(({ filter }) => [
 *   filter({
 *     name: "jinsu",
 *   }),
 * ]);
 *
 * ```
 */
export function filterConstructor<Schema, PK extends keyof Schema>({ toDateString }: Context): FilterReducer<Schema, PK> {
  return (params) => {
    return ({ FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      FilterExpression: `${FilterExpression ? `${FilterExpression} and ` : ""}${Object.keys(params)
        .map((key) => `${preffix("#")(key)} = ${preffix(":")(key)}`)
        .join(" and ")}`,
      ExpressionAttributeNames: {
        ...(ExpressionAttributeNames ?? {}),
        ...attributeNamesMapper()(params),
      },
      ExpressionAttributeValues: {
        ...(ExpressionAttributeValues ?? {}),
        ...attributeValuesMapper(toDateString)(params),
      },
    });
  };
}

export type MockFilterReducer<Schema, PK extends keyof Schema> = MockReducer<FilterReducer<Schema, PK>, "filter">;

export function mockFilterReducer<Schema, PK extends keyof Schema>(
  ...[params]: Parameters<MockFilterReducer<Schema, PK>>
): ReturnType<MockFilterReducer<Schema, PK>> {
  return ({ filter }) => ({
    filter: {
      ...(filter ?? {}),
      ...params,
    },
  });
}
