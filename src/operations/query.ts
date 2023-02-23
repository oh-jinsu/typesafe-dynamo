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
import { GSIManifest } from "../types/gsi";

export type QueryReducers<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIManifest<Schema>> = {
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  nextOf: NextOfReducer<Schema, PK, SK>;
  indexName: <IndexName extends keyof GSI>(
    name: IndexName,
  ) => {
    condition: ConditionReducer<Schema, GSI[IndexName][0], GSI[IndexName][1]>;
    filter: FilterReducer<Schema, GSI[IndexName][0]>;
    nextOf: NextOfReducer<Schema, GSI[IndexName][0], GSI[IndexName][1]>;
  };
  select: SelectReducer<Schema>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIManifest<Schema> = Record<string, never>> = Operation<
  QueryReducers<Schema, PK, SK, GSI>,
  DynamoDB.QueryInput,
  Schema[]
>;

export function queryConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIManifest<Schema> = Record<string, never>>(
  ...[client, name, option]: OperationProps
): QueryOperation<Schema, PK, SK, GSI> {
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
          indexName: <IndexName extends keyof GSI>(value: IndexName) => {
            const indexName = value.toString();

            return {
              condition: conditionConstructor<Schema, GSI[IndexName][0], GSI[IndexName][1]>({ indexName, toDateString }),
              filter: filterConstructor<Schema, GSI[IndexName][0]>({ indexName, toDateString }),
              nextOf: nextOfConstructor<Schema, GSI[IndexName][0], GSI[IndexName][1]>({ indexName, toDateString }),
            };
          },
          limit,
          direction,
        }).reduce(fold, {
          TableName: name,
          FilterExpression: option?.soft ? "(attribute_not_exists(deletedAt) or deletedAt = :null)" : undefined,
          ExpressionAttributeValues: option?.soft
            ? {
                ":null": null,
              }
            : undefined,
        }),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };
}
