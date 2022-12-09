import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { mockValuesReducer, valuesConstructor, ValuesReducer } from "../reducers/values";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { MockBuilderIntepreter } from "../types/builder";

export type PutReducers<Schema> = {
  values: ValuesReducer<Schema>;
};

export type PutOperation<Schema> = Operation<PutReducers<Schema>, DynamoDB.PutItemInput, Schema>;

export function putConstructor<Schema>(...[client, name, option]: OperationProps): PutOperation<Schema> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const values = valuesConstructor<Schema>({ toDateString });

    const params = builder({
      values,
    }).reduce(fold, {
      TableName: name,
    });

    await client.put(params).promise();

    return usefulObjectMapper(fromDateString)(params.Item);
  };
}

export function buildMockPut<Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<PutOperation<Schema>>>
): ReturnType<MockBuilderIntepreter<PutOperation<Schema>>> {
  return async (builder) => {
    const params = builder({
      values: mockValuesReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
