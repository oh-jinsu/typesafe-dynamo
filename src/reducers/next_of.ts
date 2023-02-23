import { DynamoDB } from "aws-sdk";
import { acceptableObjectMapper } from "../mappers/acceptable";
import { ReducerSlice } from "../types/reducer";

type Context = {
  indexName?: string;
  toDateString: (value: Date) => string;
};

export type NextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Pick<Schema, PK | SK>,
) => ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "ExclusiveStartKey" | "IndexName">;

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
export function nextOfConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({
  toDateString,
  indexName,
}: Context): NextOfReducer<Schema, PK, SK> {
  return (params) => {
    return () => ({
      IndexName: indexName,
      ExclusiveStartKey: acceptableObjectMapper(toDateString)(params),
    });
  };
}
