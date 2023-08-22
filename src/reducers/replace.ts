import { DynamoDB } from "aws-sdk";
import { attributeNamesReducer, attributeValuesReducer } from "../mappers/attributes";
import { expressionReducer } from "../mappers/expression";
import { PuttableRecordOf } from "../types/puttable";
import { ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type ReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: PuttableRecordOf<Partial<Omit<Schema, PK | SK>>>,
) => ReducerSlice<DynamoDB.UpdateItemInput, "UpdateExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues">;

/**
 * Replace values of the entity.
 * It automatically update the `updated_at` property.
 * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
 *
 * ## Example
 * ```
 * const result = await user.update(({ key, replace }) => [
 *   key({
 *     id: 1,
 *   })
 *   replace({
 *     name: "Jinsu",
 *   }),
 * ]);
 *
 * ```
 */
export function replaceConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>({ toDateString }: Context): ReplaceReducer<Schema, PK, SK> {
  return (params) => {
    return ({ UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => {
      const entries = Object.entries({
        ...params,
      });

      return {
        UpdateExpression: `set ${entries.reduce(expressionReducer(", "), UpdateExpression?.replace(/^set\s/, ""))}`,
        ExpressionAttributeNames: entries.reduce(attributeNamesReducer(), ExpressionAttributeNames),
        ExpressionAttributeValues: entries.reduce(attributeValuesReducer(toDateString), ExpressionAttributeValues),
      };
    };
  };
}
