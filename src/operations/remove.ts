import { DynamoDB } from "aws-sdk";
import { keyConstructor, KeyReducer, mockKeyReducer } from "../reducers/key";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { MockBuilderIntepreter } from "../types/builder";

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

export function buildMockRemove<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<RemoveOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<RemoveOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      key: mockKeyReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
