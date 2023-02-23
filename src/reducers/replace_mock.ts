import { MockReducer } from "../types/reducer";
import { ReplaceReducer } from "./replace";

export type MockReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<ReplaceReducer<Schema, PK, SK>, "replace">;

export function mockReplaceReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockReplaceReducer<Schema, PK, SK>>
): ReturnType<MockReplaceReducer<Schema, PK, SK>> {
  return ({ replace }) => ({
    replace: [
      {
        ...(replace?.[0] ?? {}),
        ...params,
      },
    ],
  });
}
