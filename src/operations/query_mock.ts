import { fold } from "../common/fold";
import { mockConditionReducer } from "../reducers/condition_mock";
import { mockDirectionReducer } from "../reducers/direction_mock";
import { mockFilterReducer } from "../reducers/filter_mock";
import { mockLimitReducer } from "../reducers/limit_mock";
import { mockSelectReducer } from "../reducers/select_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { QueryOperation } from "./query";

export function buildMockQuery<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<QueryOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<QueryOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      condition: mockConditionReducer,
      filter: mockFilterReducer,
      select: mockSelectReducer,
      limit: mockLimitReducer,
      direction: mockDirectionReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
