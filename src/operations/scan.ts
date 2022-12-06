import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { filterConstructor, FilterReducer } from "../reducers/filter";
import { indexNameConstructor, IndexNameReducer } from "../reducers/index_name";
import { limitConstructor, LimitReducer } from "../reducers/limit";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";

export type ScanBuilder<Schema, PK extends keyof Schema> = {
  index: IndexNameReducer;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
};

export type ScanOperation<Schema, PK extends keyof Schema> = Operation<ScanBuilder<Schema, PK>, DynamoDB.ScanInput, Schema[]>;

export function scanConstructor<Schema, PK extends keyof Schema>(...[client, name, option]: OperationProps): ScanOperation<Schema, PK> {
  return async (query) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const index = indexNameConstructor();

    const limit = limitConstructor();

    const { Items } = await client
      .scan(
        query({
          index,
          filter,
          select,
          limit,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };
}
