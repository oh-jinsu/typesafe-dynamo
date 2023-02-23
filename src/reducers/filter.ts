import { DynamoDB } from "aws-sdk";
import { attributeNamesMapper, attributeValuesMapper } from "../mappers/attributes";
import { preffix } from "../mappers/preffix";
import { ReducerSlice } from "../types/reducer";

type Context = {
  indexName?: string;
  toDateString: (value: Date) => string;
};

export type FilterReducer<Schema, PK extends keyof Schema> = (
  params: Partial<Omit<Schema, PK>>,
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
export function filterConstructor<Schema, PK extends keyof Schema>({ toDateString, indexName }: Context): FilterReducer<Schema, PK> {
  return (params) => {
    return ({ FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      IndexName: indexName,
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
