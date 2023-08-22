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
import { GSIList } from "../types/gsi";
import { equalWith, notExists, or } from "../mappers/puttable";
import { withError } from "./with_error";
import { getDateMappers } from "../mappers/date_mappers";

export type QueryReducers<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIList<Schema>> = {
  condition: ConditionReducer<Schema, PK, SK>;
  filter: FilterReducer<Schema, PK>;
  nextOf: NextOfReducer<Schema, PK, SK>;
  indexName: <IndexName extends keyof GSI>(
    name: IndexName,
  ) => Omit<QueryReducers<Schema, GSI[IndexName][0], GSI[IndexName][1], Record<string, never>>, "indexName">;
  select: SelectReducer<Schema>;
  limit: LimitReducer;
  direction: DirectionReducer;
};

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIList<Schema> = Record<string, never>> = Operation<
  QueryReducers<Schema, PK, SK, GSI>,
  DynamoDB.QueryInput,
  Schema[]
>;

export function queryConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIList<Schema> = Record<string, never>>(
  ...[client, name, option]: OperationProps
): QueryOperation<Schema, PK, SK, GSI> {
  return async (builder) => {
    const { toDate, fromDate, validateDate } = getDateMappers(option);

    const condition = conditionConstructor<Schema, PK, SK>({ toDate });

    const filter = filterConstructor<Schema, PK>({ toDate });

    const select = selectConstructor<Schema>();

    const nextOf = nextOfConstructor<Schema, PK, SK>({ toDate });

    const limit = limitConstructor();

    const direction = directionConstructor();

    const reducers = (() => {
      const commons = builder({
        condition,
        filter,
        select,
        nextOf,
        indexName: <IndexName extends keyof GSI>(value: IndexName) => {
          const indexName = value.toString();

          type GSIPK = GSI[IndexName][0];

          type GSISK = GSI[IndexName][1];

          return {
            condition: conditionConstructor<Schema, GSIPK, GSISK>({ indexName, toDate }),
            filter: filterConstructor<Schema, GSIPK>({ indexName, toDate }),
            nextOf: nextOfConstructor<Schema, GSIPK, GSISK>({ indexName, toDate }),
            select: selectConstructor<Schema>(),
            limit: limitConstructor(),
            direction: directionConstructor(),
          };
        },
        limit,
        direction,
      });

      if (option?.soft) {
        return [
          ...commons,
          filter({
            deletedAt: or(notExists(), equalWith(null)),
          } as any),
        ];
      }

      return commons;
    })();

    const { Items } = await withError(() =>
      client
        .query(
          reducers.reduce(fold, {
            TableName: name,
          }),
        )
        .promise(),
    );

    return usefulObjectMapper(fromDate, validateDate)(Items);
  };
}
