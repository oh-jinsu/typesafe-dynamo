import { DynamoDB } from "aws-sdk";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { replaceConstructor } from "../reducers/replace";
import { withError } from "./with_error";
import { getDateMappers } from "../mappers/date_mappers";

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
    const { toDate } = getDateMappers(option);

    const key = keyConstructor<Schema, PK, SK>({ toDate });

    await withError(() => {
      const replace = replaceConstructor({ toDate });

      if (option?.soft) {
        const input = [
          ...builder({
            key,
          }),
          replace({
            deletedAt: new Date(),
          }),
        ].reduce(fold, {
          TableName: name,
        });

        return client.update(input).promise();
      }

      return client
        .delete(
          builder({
            key,
          }).reduce(fold, {
            TableName: name,
          }),
        )
        .promise();
    });
  };
}
