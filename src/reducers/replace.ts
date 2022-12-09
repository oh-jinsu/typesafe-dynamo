import { DynamoDB } from "aws-sdk";
import { attributeNamesMapper, attributeValuesMapper } from "../mappers/attributes";
import { preffix } from "../mappers/preffix";
import { DateColumnList } from "../types/date_column_list";
import { MockReducer, ReducerSlice } from "../types/reducer";

type Context = {
  toDateString: (value: Date) => string;
};

export type ReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  params: Partial<Omit<Schema, PK | SK | DateColumnList>>,
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
    return ({ UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      UpdateExpression: `${UpdateExpression ? `${UpdateExpression},` : "set #updatedAt = :updatedAt,"} ${Object.keys(params)
        .map((key) => `${preffix("#")(key)} = ${preffix(":")(key)}`)
        .join(", ")}`,
      ExpressionAttributeNames: {
        ...(ExpressionAttributeNames ?? {}),
        ...attributeNamesMapper()({
          ...params,
          updatedAt: new Date(),
        }),
      },
      ExpressionAttributeValues: {
        ...(ExpressionAttributeValues ?? {}),
        ...attributeValuesMapper(toDateString)({
          ...params,
          updatedAt: new Date(),
        }),
      },
    });
  };
}

export type MockReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<ReplaceReducer<Schema, PK, SK>, "replace">;

export function mockReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockReplaceReducer<Schema, PK, SK>>
): ReturnType<MockReplaceReducer<Schema, PK, SK>> {
  return ({ replace }) => ({
    replace: {
      ...(replace ?? {}),
      ...params,
    },
  });
}
