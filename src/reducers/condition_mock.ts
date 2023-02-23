import { MockReducer } from "../types/reducer";
import { ConditionReducer } from "./condition";

export type MockConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema> = MockReducer<ConditionReducer<Schema, PK, SK>, "condition">;

export function mockConditionReducer<Schema, PK extends keyof Schema, SK extends keyof Schema>(
  ...[first, second]: Parameters<MockConditionReducer<Schema, PK, SK>>
): ReturnType<MockConditionReducer<Schema, PK, SK>> {
  return ({ condition }) => {
    const [firstCondition, secondCondition] = condition ?? [];

    if (typeof first === "string") {
      if (typeof firstCondition === "string") {
        return {
          condition: [
            first,
            {
              ...(secondCondition ?? {}),
              ...second,
            },
          ],
        };
      }

      return {
        condition: [
          first,
          {
            ...(firstCondition ?? {}),
            ...second,
          },
        ],
      };
    }

    if (typeof firstCondition === "string") {
      return {
        condition: [
          {
            ...(secondCondition ?? {}),
            ...first,
          },
        ],
      };
    }

    return {
      condition: [
        {
          ...(firstCondition ?? {}),
          ...first,
        },
      ],
    };
  };
}
