import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { valuesConstructor, ValuesReducer } from "../reducers/values";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";

export type PutBuilder<Schema> = {
  values: ValuesReducer<Schema>;
};

export type PutOperation<Schema> = Operation<PutBuilder<Schema>, DynamoDB.PutItemInput, Schema>;

export function putConstructor<Schema>(...[client, name, option]: OperationProps): PutOperation<Schema> {
  return async (query) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const values = valuesConstructor<Schema>({ toDateString });

    const params = query({
      values,
    }).reduce(fold, {
      TableName: name,
    });

    await client.put(params).promise();

    return usefulObjectMapper(fromDateString)(params.Item);
  };
}
