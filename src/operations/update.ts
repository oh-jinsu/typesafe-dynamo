import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { replaceConstructor, ReplaceReducer } from "../reducers/replace";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { getDateMappers } from "../mappers/date_mappers";

export type UpdateReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
  replace: ReplaceReducer<Schema, PK, SK>;
};

export type UpdateOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<
  UpdateReducers<Schema, PK, SK>,
  DynamoDB.UpdateItemInput,
  Schema
>;

export function updateConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): UpdateOperation<Schema, PK, SK> {
  return async (reducers) => {
    const { toDate, fromDate, validateDate } = getDateMappers(option);

    const key = keyConstructor<Schema, PK, SK>({ toDate });

    const replace = replaceConstructor<Schema, PK, SK>({ toDate });

    const input = reducers({
      key,
      replace,
    }).reduce(fold, {
      TableName: name,
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await client.update(input).promise();

    return usefulObjectMapper(fromDate, validateDate)(Attributes);
  };
}
