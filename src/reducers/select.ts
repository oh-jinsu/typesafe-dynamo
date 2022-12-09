import { DynamoDB } from "aws-sdk";
import { preffix } from "../mappers/preffix";
import { MockSpreadReducer, ReducerSlice } from "../types/reducer";

export type SelectReducer<Schema> = (
  ...params: (keyof Schema)[]
) => ReducerSlice<DynamoDB.GetItemInput | DynamoDB.QueryInput | DynamoDB.ScanInput, "ProjectionExpression" | "ExpressionAttributeNames">;

/**
 * Select properties of the entity to read.
 *
 * ## Example
 * ```
 * const result = await user.get(({ key, select }) => [
 *   key({
 *     id: 1,
 *   }),
 *   select("id", "name"),
 * ]);
 *
 * ```
 */
export function selectConstructor<Schema>(): SelectReducer<Schema> {
  return (
      ...params: (keyof Schema)[]
    ): ReducerSlice<DynamoDB.GetItemInput | DynamoDB.QueryInput | DynamoDB.ScanInput, "ProjectionExpression" | "ExpressionAttributeNames"> =>
    ({ ProjectionExpression, ExpressionAttributeNames }) => ({
      ProjectionExpression: `${ProjectionExpression ? `${ProjectionExpression}, ` : ""}${params.map((param) => preffix("#")(param.toString())).join(", ")}`,
      ExpressionAttributeNames: params.reduce(
        (attributes, key) => ({
          ...attributes,
          [preffix("#")(key.toString())]: key,
        }),
        ExpressionAttributeNames || ({} as any),
      ),
    });
}

export type MockSelectReducer<Schema> = MockSpreadReducer<SelectReducer<Schema>, "select">;

export function mockSelectReducer<Schema>(...params: Parameters<MockSelectReducer<Schema>>): ReturnType<MockSelectReducer<Schema>> {
  return ({ select }) => ({
    select: [...(select ?? []), ...params],
  });
}
