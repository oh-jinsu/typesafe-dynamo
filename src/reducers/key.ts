import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDate: (value: Date) => any;
};

export type KeyReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Pick<Schema, PK | SK>,
) => ReducerSlice<DynamoDB.GetItemInput | DynamoDB.UpdateItemInput | DynamoDB.DeleteItemInput, "Key">;

/**
 * Pass the entry of the partion key.
 *
 * ## Example
 * ```
 * const result = await user.get(({ key }) => [
 *   key({
 *     id: 1,
 *   }),
 * ]);
 *
 * ```
 */
export function keyConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({ toDate }: Context): KeyReducer<Schema, PK, SK> {
  return (params) => {
    return () => ({
      Key: acceptableObjectMapper(toDate)(params),
    });
  };
}
