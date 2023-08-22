import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { keyConstructor, KeyReducer } from "../reducers/key";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { withError } from "./with_error";
import { getDateMappers } from "../mappers/date_mappers";

export type GetReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  key: KeyReducer<Schema, PK, SK>;
  select: SelectReducer<Schema>;
};

export type GetOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<
  GetReducers<Schema, PK, SK>,
  DynamoDB.GetItemInput,
  Schema | undefined
>;

export function getConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): GetOperation<Schema, PK, SK> {
  return async (builder) => {
    const { toDate, fromDate, validateDate } = getDateMappers(option);

    const key = keyConstructor<Schema, PK, SK>({ toDate });

    const select = selectConstructor<Schema>();

    const { Item } = await withError(() =>
      client
        .get(
          builder({
            key,
            select,
          }).reduce(fold, {
            TableName: name,
          }),
        )
        .promise(),
    );

    if (!Item) {
      return;
    }

    if (option?.soft === true && Item["deletedAt"]) {
      return;
    }

    return usefulObjectMapper(fromDate, validateDate)(Item);
  };
}
