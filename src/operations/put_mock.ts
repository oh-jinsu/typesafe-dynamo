import { fold } from "../common/fold";
import { mockValuesReducer } from "../reducers/values_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { PutOperation } from "./put";

export function buildMockPut<Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<PutOperation<Schema>>>
): ReturnType<MockBuilderIntepreter<PutOperation<Schema>>> {
  return async (builder) => {
    const params = builder({
      values: mockValuesReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
