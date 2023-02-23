import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { conditionConstructor, ConditionReducer } from "../reducers/condition";
import { directionConstructor, DirectionReducer } from "../reducers/direction";
import { filterConstructor, FilterReducer } from "../reducers/filter";
import { limitConstructor, LimitReducer } from "../reducers/limit";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { nextOfConstructor, NextOfReducer } from "../reducers/next_of";

export type QueryReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  nextOf: NextOfReducer<Schema, PK, SK>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<QueryReducers<Schema, PK, SK>, DynamoDB.QueryInput, Schema[]>;

export type GSIManifest<Schema> = Record<string, GSIElement<Schema>>;

export type GSIElement<Schema> = {
  pk: keyof Schema;
  sk: keyof Schema;
};

export function queryConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIManifest<Schema> = Record<string, never>>(
  ...[client, name, option]: OperationProps
): QueryOperation<Schema, PK, SK> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const condition = conditionConstructor<Schema, PK, SK>({ toDateString });

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const nextOf = nextOfConstructor<Schema, PK, SK>({ toDateString });

    const limit = limitConstructor();

    const direction = directionConstructor();

    const { Items } = await client
      .query(
        builder({
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
