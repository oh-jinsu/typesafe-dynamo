import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { keyConstructor, KeyReducer, mockKeyReducer } from "../reducers/key";
import { mockSelectReducer, selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { MockBuilderIntepreter } from "../types/builder";

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
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    const select = selectConstructor<Schema>();

    const { Item } = await client
      .get(
        builder({
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

export function buildMockGet<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<GetOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<GetOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      key: mockKeyReducer,
      select: mockSelectReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
