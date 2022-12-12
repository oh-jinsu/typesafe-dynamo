import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { conditionConstructor, ConditionReducer, mockConditionReducer } from "../reducers/condition";
import { directionConstructor, DirectionReducer, mockDirectionReducer } from "../reducers/direction";
import { filterConstructor, FilterReducer, mockFilterReducer } from "../reducers/filter";
import { indexNameConstructor, IndexNameReducer, mockIndexNameReducer } from "../reducers/index_name";
import { limitConstructor, LimitReducer, mockLimitReducer } from "../reducers/limit";
import { mockSelectReducer, selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { MockBuilderIntepreter } from "../types/builder";
import { nextOfConstructor, NextOfReducer } from "../reducers/next_of";

export type QueryReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  indexName: IndexNameReducer;
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  nextOf: NextOfReducer<Schema, PK, SK>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<QueryReducers<Schema, PK, SK>, DynamoDB.QueryInput, Schema[]>;

export function queryConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): QueryOperation<Schema, PK, SK> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const condition = conditionConstructor<Schema, PK, SK>({ toDateString });

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const indexName = indexNameConstructor();

    const nextOf = nextOfConstructor<Schema, PK, SK>({ toDateString });

    const limit = limitConstructor();

    const direction = directionConstructor();

    const { Items } = await client
      .query(
        builder({
          indexName,
          condition,
          filter,
          select,
          nextOf,
          limit,
          direction,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };
}

export function buildMockQuery<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<QueryOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<QueryOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      indexName: mockIndexNameReducer,
      condition: mockConditionReducer,
      filter: mockFilterReducer,
      select: mockSelectReducer,
      limit: mockLimitReducer,
      direction: mockDirectionReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
