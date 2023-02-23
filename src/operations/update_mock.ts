import { fold } from "../common/fold";
import { mockKeyReducer } from "../reducers/key_mock";
import { mockReplaceReducer } from "../reducers/replace_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { UpdateOperation } from "./update";

export function buildMockUpdate<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<UpdateOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<UpdateOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      key: mockKeyReducer,
      replace: mockReplaceReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
