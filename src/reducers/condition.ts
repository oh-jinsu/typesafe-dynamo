import { DynamoDB } from "aws-sdk";
import { attributeNamesReducer, attributeValuesReducer } from "../mappers/attributes";
import { expressionReducer } from "../mappers/expression";
import { ReducerSlice } from "../types/reducer";

type Context = {
  indexName?: string;
  toDateString: (value: Date) => string;
};

export type ConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Partial<Pick<Schema, PK | SK>>,
) => ReducerSlice<DynamoDB.QueryInput, "KeyConditionExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues" | "IndexName">;

/**
 * Pass the entry of the partion key or the sort key.
 * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
 * ## Example
 * ```
 * const result = await user.query(({ condition }) => [
 *   condition({
 *     id: 1,
 *     lastName: "Oh",
 *   }),
 * ]);
 *
 * ```
 */
export function conditionConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({
  toDateString,
  indexName,
}: Context): ConditionReducer<Schema, PK, SK> {
  return (params) => {
    return ({ KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      IndexName: indexName,
      KeyConditionExpression: Object.entries(params).reduce(expressionReducer(" and "), KeyConditionExpression),
      ExpressionAttributeNames: Object.entries(params).reduce(attributeNamesReducer(), ExpressionAttributeNames),
      ExpressionAttributeValues: Object.entries(params).reduce(attributeValuesReducer(toDateString), ExpressionAttributeValues),
    });
  };
}
