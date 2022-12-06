import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { conditionConstructor, ConditionReducer } from "../reducers/condition";
import { directionConstructor, DirectionReducer } from "../reducers/direction";
import { filterConstructor, FilterReducer } from "../reducers/filter";
import { indexNameConstructor, IndexNameReducer } from "../reducers/index_name";
import { limitConstructor, LimitReducer } from "../reducers/limit";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";

export type QueryBuilder<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  index: IndexNameReducer;
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<QueryBuilder<Schema, PK, SK>, DynamoDB.QueryInput, Schema[]>;

export function queryConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): QueryOperation<Schema, PK, SK> {
  return async (query) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const condition = conditionConstructor<Schema, PK, SK>({ toDateString });

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const index = indexNameConstructor();

    const limit = limitConstructor();

    const direction = directionConstructor();

    const { Items } = await client
      .query(
        query({
          index,
          condition,
          filter,
          select,
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
