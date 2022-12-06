import { DynamoDB } from "aws-sdk";
import { ReducerSlice } from "../types/reducer";

export type IndexNameReducer = (params: string) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "IndexName">;

/**
 * Set the index of the schema.
 *
 * ## Example
 * ```
 * const result = await user.query(({ condition, indexName }) => [
 *   indexName("NameAndAgeIndex")
 *   condition({
 *     age: 25,
 *   }),
 * ]);
 *
 * ```
 */
export function indexNameConstructor(): IndexNameReducer {
  return (params) => () => ({
    IndexName: params,
  });
}
