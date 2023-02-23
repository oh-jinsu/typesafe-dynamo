import { fold } from "../common/fold";
import { mockKeyReducer } from "../reducers/key_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { RemoveOperation } from "./remove";

export function buildMockRemove<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<RemoveOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<RemoveOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      key: mockKeyReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
