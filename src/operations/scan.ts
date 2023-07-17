import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "../mappers/useful";
import { filterConstructor, FilterReducer } from "../reducers/filter";
import { limitConstructor, LimitReducer } from "../reducers/limit";
import { selectConstructor, SelectReducer } from "../reducers/select";
import { Operation, OperationProps } from "../types/operation";
import { fold } from "../common/fold";
import { nextOfConstructor, NextOfReducer } from "../reducers/next_of";
import { or, equalWith, notExists } from "../mappers/puttable";
import { withError } from "./with_error";

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

    const reducers = (() => {
      if (option?.soft) {
        return [
          ...builder({
            filter,
            select,
            nextOf,
            limit,
          }),
          filter({
            deletedAt: or(notExists(), equalWith(null)),
          } as any),
        ];
      }

      return builder({
        filter,
        select,
        nextOf,
        limit,
      });
    })();

    const input = reducers.reduce(fold, {
      TableName: name,
    });

    const { Items } = await withError(() => client.scan(input).promise());

    return usefulObjectMapper(fromDateString)(Items);
  };
}
