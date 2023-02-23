import { fold } from "../common/fold";
import { mockFilterReducer } from "../reducers/filter_mock";
import { mockLimitReducer } from "../reducers/limit_mock";
import { mockSelectReducer } from "../reducers/select_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { ScanOperation } from "./scan";

export function buildMockScan<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<ScanOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<ScanOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      filter: mockFilterReducer,
      select: mockSelectReducer,
      limit: mockLimitReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
