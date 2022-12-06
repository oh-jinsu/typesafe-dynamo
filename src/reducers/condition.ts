import { DynamoDB } from "aws-sdk";
import { attributeNamesMapper, attributeValuesMapper } from "../mappers/attributes";
import { preffix } from "../mappers/preffix";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type ConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Partial<Pick<Schema, PK | SK>>,
) => ReducerSlice<DynamoDB.QueryInput, "KeyConditionExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues">;

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
  return (params) => {
    return ({ KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      KeyConditionExpression: `${KeyConditionExpression ? `${KeyConditionExpression} and ` : ""}${Object.keys(params)
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
