import { DynamoDB } from "aws-sdk";
import { attributeNamesMapper, attributeValuesMapper } from "../mappers/attributes";
import { preffix } from "../mappers/preffix";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type ConditionReducerArguments<Schema, PK extends keyof Schema, SK extends keyof Schema> =
  | [Partial<Pick<Schema, PK | SK>>]
  | [string, Partial<Pick<Schema, PK | SK>>];

export type ConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  ...params: ConditionReducerArguments<Schema, PK, SK>
) => ReducerSlice<DynamoDB.QueryInput, "KeyConditionExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues" | "IndexName">;

/**
 * Pass the entry of the partion key or the sort key.
 * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
 * ## Example
 * ```
 * const result = await user.query(({ condition }) => [
 *   condition({
 *     id: 1,
 *     lastName: "Oh",
 *   }),
 * ]);
 *
 * ```
 */
export function conditionConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({ toDateString }: Context): ConditionReducer<Schema, PK, SK> {
  return (...[first, second]) => {
    if (typeof first === "string") {
      return ({ KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
        IndexName: first,
        KeyConditionExpression: `${KeyConditionExpression ? `${KeyConditionExpression} and ` : ""}${Object.keys(second ?? {})
          .map((key) => `${preffix("#")(key)} = ${preffix(":")(key)}`)
          .join(" and ")}`,

        ExpressionAttributeNames: {
          ...(ExpressionAttributeNames ?? {}),
          ...attributeNamesMapper()(second),
        },
        ExpressionAttributeValues: {
          ...(ExpressionAttributeValues ?? {}),
          ...attributeValuesMapper(toDateString)(second),
        },
      });
    }

    return ({ KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, IndexName }) => ({
      IndexName: IndexName,
      KeyConditionExpression: `${KeyConditionExpression ? `${KeyConditionExpression} and ` : ""}${Object.keys(first)
        .map((key) => `${preffix("#")(key)} = ${preffix(":")(key)}`)
        .join(" and ")}`,
      ExpressionAttributeNames: {
        ...(ExpressionAttributeNames ?? {}),
        ...attributeNamesMapper()(first),
      },
      ExpressionAttributeValues: {
        ...(ExpressionAttributeValues ?? {}),
        ...attributeValuesMapper(toDateString)(first),
      },
    });
  };
}
