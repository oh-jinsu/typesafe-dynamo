import { DynamoDB } from "aws-sdk";
import { ReducerSlice } from "../types/reducer";

export type DirectionReducer = (params: "FORWARD" | "BACKWARD") => ReducerSlice<DynamoDB.QueryInput, "ScanIndexForward">;

/**
 * Set the direction of quering.
 *
 * ## Example
 * ```
 * const result = await user.query(({ condition, direction }) => [
 *   condition({
 *     id: 1,
 *     lastName: "Oh",
 *   }),
 *   direction("FORWARD")
 * ]);
 *
 * ```
 */
export function directionConstructor(): DirectionReducer {
  return (params) => () => ({
    ScanIndexForward: params === "FORWARD",
  });
}
