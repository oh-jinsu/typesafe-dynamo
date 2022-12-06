import { DynamoDB } from "aws-sdk";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";

export type RemoveBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
};

export type RemoveOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<
  RemoveBuilder<Schema, PK, SK>,
  DynamoDB.DeleteItemInput,
  void
>;

export function removeConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): RemoveOperation<Schema, PK, SK> {
  return async (query) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    await client
      .delete(
        query({
          key,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();
  };
}
