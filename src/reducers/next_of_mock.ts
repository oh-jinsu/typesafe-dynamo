import { MockReducer } from "../types/reducer";
import { NextOfReducer } from "./next_of";

export type MockNextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<NextOfReducer<Schema, PK, SK>, "nextOf">;

export function mockNextOfReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockNextOfReducer<Schema, PK, SK>>
): ReturnType<MockNextOfReducer<Schema, PK, SK>> {
  return () => ({
    nextOf: [params],
  });
}
