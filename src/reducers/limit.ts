import { DynamoDB } from "aws-sdk";
import { ReducerSlice } from "../types/reducer";

export type LimitReducer = (params: number) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "Limit">;

/**
 * Limit the maximum count of result elements.
 *
 * ## Example
 * ```
 * const result = await user.scan(({ filter, limit }) => [
 *   filter({
 *     age: 25,
 *   }),
 *   limit(1),
 * ]);
 *
 * ```
 */
export function limitConstructor(): LimitReducer {
  return (params) => () => ({
    Limit: params,
  });
}
