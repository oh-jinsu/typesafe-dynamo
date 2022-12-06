import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";

export type GetBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
  select: SelectReducer<Schema>;
};

export type GetOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<
  GetBuilder<Schema, PK, SK>,
  DynamoDB.GetItemInput,
  Schema | undefined
>;

export function getConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): GetOperation<Schema, PK, SK> {
  return async (query) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    const select = selectConstructor<Schema>();

    const { Item } = await client
      .get(
        query({
          key,
          select,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();

    if (!Item) {
      return;
    }

    return usefulObjectMapper(fromDateString)(Item);
  };
}
