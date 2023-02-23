import { MockReducer } from "../types/reducer";
import { LimitReducer } from "./limit";

export type MockLimitReducer = MockReducer<LimitReducer, "limit">;

export function mockLimitReducer(...[params]: Parameters<MockLimitReducer>): ReturnType<MockLimitReducer> {
  return () => ({
    limit: [params],
  });
}
