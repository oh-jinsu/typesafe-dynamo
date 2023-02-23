import { MockSpreadReducer } from "../types/reducer";
import { SelectReducer } from "./select";

export type MockSelectReducer<Schema> = MockSpreadReducer<SelectReducer<Schema>, "select">;

export function mockSelectReducer<Schema>(...params: Parameters<MockSelectReducer<Schema>>): ReturnType<MockSelectReducer<Schema>> {
  return ({ select }) => ({
    select: [...(select ?? []), ...params],
  });
}
