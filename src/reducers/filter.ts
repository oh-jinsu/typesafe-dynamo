import { DynamoDB } from "aws-sdk";
import { attributeNamesReducer, attributeValuesReducer } from "../mappers/attributes";
import { expressionReducer } from "../mappers/expression";
import { PuttableRecordOf } from "../types/puttable";
import { ReducerSlice } from "../types/reducer";

type Context = {
  indexName?: string;
  toDate: (value: Date) => any;
};

export type FilterReducer<Schema, PK extends keyof Schema> = (
  params: PuttableRecordOf<Partial<Omit<Schema, PK>>>,
) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "FilterExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues" | "IndexName">;

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

export function filterConstructor<Schema, PK extends keyof Schema>({ toDate, indexName }: Context): FilterReducer<Schema, PK> {
  return (params) => {
    return ({ FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      IndexName: indexName,
      FilterExpression: Object.entries(params).reduce(expressionReducer(" and "), FilterExpression),
      ExpressionAttributeNames: Object.entries(params).reduce(attributeNamesReducer(), ExpressionAttributeNames),
      ExpressionAttributeValues: Object.entries(params).reduce(attributeValuesReducer(toDate), ExpressionAttributeValues),
    });
  };
}
