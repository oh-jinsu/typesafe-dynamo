import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { filterConstructor, FilterReducer } from "../reducers/filter";
import { limitConstructor, LimitReducer } from "../reducers/limit";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { nextOfConstructor, NextOfReducer } from "../reducers/next_of";

export type ScanReducers<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  filter: FilterReducer<Schema, PK>;
  select: SelectReducer<Schema>;
  nextOf: NextOfReducer<Schema, PK, SK>;
  limit: LimitReducer;
};

export type ScanOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = Operation<ScanReducers<Schema, PK, SK>, DynamoDB.ScanInput, Schema[]>;

export function scanConstructor<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[client, name, option]: OperationProps
): ScanOperation<Schema, PK, SK> {
  return async (builder) => {
    const toDateString = option?.toDateString ?? ((value) => value.toISOString());

    const fromDateString = option?.fromDateString ?? ((value) => new Date(value));

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const nextOf = nextOfConstructor<Schema, PK, SK>({ toDateString });

    const limit = limitConstructor();

    const { Items } = await client
      .scan(
        builder({
          filter,
          select,
          nextOf,
          limit,
        }).reduce(fold, {
          TableName: name,
        }),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };
}
