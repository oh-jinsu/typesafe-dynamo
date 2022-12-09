import { DynamoDB } from "aws-sdk";
import { MockReducer, ReducerSlice } from "../types/reducer";

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

export type MockIndexNameReducer = MockReducer<IndexNameReducer, "indexName">;

export function mockIndexNameReducer(...[params]: Parameters<MockIndexNameReducer>): ReturnType<MockIndexNameReducer> {
  return () => ({
    indexName: params,
  });
}
