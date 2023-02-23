import { fold } from "../common/fold";
import { mockKeyReducer } from "../reducers/key_mock";
import { mockSelectReducer } from "../reducers/select_mock";
import { MockBuilderIntepreter } from "../types/builder";
import { GetOperation } from "./get";

export function buildMockGet<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[fn]: Parameters<MockBuilderIntepreter<GetOperation<Schema, PK, SK>>>
): ReturnType<MockBuilderIntepreter<GetOperation<Schema, PK, SK>>> {
  return async (builder) => {
    const params = builder({
      key: mockKeyReducer,
      select: mockSelectReducer,
    } as any).reduce(fold, {});

    return fn(params);
  };
}
