import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { filterConstructor, FilterReducer, mockFilterReducer } from "../reducers/filter";
import { indexNameConstructor, IndexNameReducer, mockIndexNameReducer } from "../reducers/index_name";
import { limitConstructor, LimitReducer, mockLimitReducer } from "../reducers/limit";
import { mockSelectReducer, selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { MockBuilderIntepreter } from "../types/builder";

export type ScanReducers<Schema, PK extends keyof Schema> = {
  indexName: IndexNameReducer;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
};

export type ScanOperation<Schema, PK extends keyof Schema> = Operation<ScanReducers<Schema, PK>, DynamoDB.ScanInput, Schema[]>;

export function scanConstructor<Schema, PK extends keyof Schema>(...[client, name, option]: OperationProps): ScanOperation<Schema, PK> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const indexName = indexNameConstructor();

    const limit = limitConstructor();

    const { Items } = await client
      .scan(
        builder({
          indexName,
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

export function buildMockScan<Schema, PK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<ScanOperation<Schema, PK>>>
): ReturnType<MockBuilderIntepreter<ScanOperation<Schema, PK>>> {
  return async (builder) => {
    const params = builder({
      indexName: mockIndexNameReducer,
      filter: mockFilterReducer,
      select: mockSelectReducer,
      limit: mockLimitReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
