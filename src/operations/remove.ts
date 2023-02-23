import { DynamoDB } from "aws-sdk";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { replaceConstructor } from "../reducers/replace";

export type RemoveReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
};

export type RemoveOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<
  RemoveReducers<Schema, PK, SK>,
  DynamoDB.DeleteItemInput,
  void
>;

export function removeConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): RemoveOperation<Schema, PK, SK> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    if (option?.soft) {
      await client
        .update(
          [
            ...builder({
              key,
            }),
            replaceConstructor({ toDateString })({
              deletedAt: new Date(),
            }),
          ].reduce(fold, {
            TableName: name,
          }),
        )
        .promise();

      return;
    }

    await client
      .delete(
        builder({
          key,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();
  };
}
