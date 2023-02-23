import { MockReducer } from "../types/reducer";
import { FilterReducer } from "./filter";

export type MockFilterReducer<Schema, PK extends keyof Schema> = MockReducer<FilterReducer<Schema, PK>, "filter">;

export function mockFilterReducer<Schema, PK extends keyof Schema>(
  ...[params]: Parameters<MockFilterReducer<Schema, PK>>
): ReturnType<MockFilterReducer<Schema, PK>> {
  return ({ filter }) => ({
    filter: [
      {
        ...(filter?.[0] ?? {}),
        ...params,
      },
    ],
  });
}
