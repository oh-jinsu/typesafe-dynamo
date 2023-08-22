import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { valuesConstructor, ValuesReducer } from "../reducers/values";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { withError } from "./with_error";
import { getDateMappers } from "../mappers/date_mappers";

export type PutReducers<Schema> = {
  values: ValuesReducer<Schema>;
};

export type PutOperation<Schema> = Operation<PutReducers<Schema>, DynamoDB.PutItemInput, Schema>;

export function putConstructor<Schema>(...[client, name, option]: OperationProps): PutOperation<Schema> {
  return async (builder) => {
    const { toDate, fromDate, validateDate } = getDateMappers(option);

    const values = valuesConstructor<Schema>({ toDate });

    const params = builder({
      values,
    }).reduce(fold, {
      TableName: name,
    });

    await withError(() => client.put(params).promise());

    return usefulObjectMapper(fromDate, validateDate)(params.Item);
  };
}
