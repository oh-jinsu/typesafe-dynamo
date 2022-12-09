import { DynamoDB } from "aws-sdk";
import { MockReducer, ReducerSlice } from "../types/reducer";

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

export type MockDirectionReducer = MockReducer<DirectionReducer, "direction">;

export function mockDirectionReducer(...[params]: Parameters<MockDirectionReducer>): ReturnType<MockDirectionReducer> {
  return () => ({
    direction: params,
  });
}
