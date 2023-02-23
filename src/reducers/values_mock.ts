import { MockReducer } from "../types/reducer";
import { ValuesReducer } from "./values";

export type MockValuesReducer<Schema> = MockReducer<ValuesReducer<Schema>, "values">;

export function mockValuesReducer<Schema>(...[params]: Parameters<MockValuesReducer<Schema>>): ReturnType<MockValuesReducer<Schema>> {
  return ({ values }) => ({
    values: [
      {
        ...(values?.[0] ?? {}),
        ...params,
      },
    ],
  });
}
