import { MockReducer } from "../types/reducer";
import { KeyReducer } from "./key";

export type MockKeyReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<KeyReducer<Schema, PK, SK>, "key">;

export function mockKeyReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockKeyReducer<Schema, PK, SK>>
): ReturnType<MockKeyReducer<Schema, PK, SK>> {
  return () => ({
    key: [params],
  });
}
