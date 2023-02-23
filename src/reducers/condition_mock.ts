import { MockReducer } from "../types/reducer";
import { ConditionReducer } from "./condition";

export type MockConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<ConditionReducer<Schema, PK, SK>, "condition">;

export function mockConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[params]: Parameters<MockConditionReducer<Schema, PK, SK>>
): ReturnType<MockConditionReducer<Schema, PK, SK>> {
  return ({ condition }) => {
    return {
      condition: [
        {
          ...(condition?.[0] ?? {}),
          ...params,
        },
      ],
    };
  };
}
