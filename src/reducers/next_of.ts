import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { MockReducer, ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type NextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Pick<Schema, PK | SK>,
) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "ExclusiveStartKey">;

/**
 * The key of first item that this operation will evaluate
 *
 * ## Example
 * ```
 * const result = await user.query(({ nextOf }) => [
 *   nextOf({
 *     id: 1,
 *   }),
 * ]);
 *
 * ```
 */
export function nextOfConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({ toDateString }: Context): NextOfReducer<Schema, PK, SK> {
  return (params) => {
    return () => ({
      ExclusiveStartKey: acceptableObjectMapper(toDateString)(params),
    });
  };
}

export type MockNextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<NextOfReducer<Schema, PK, SK>, "nextOf">;

export function mockNextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockNextOfReducer<Schema, PK, SK>>
): ReturnType<MockNextOfReducer<Schema, PK, SK>> {
  return () => ({
    nextOf: params,
  });
}
