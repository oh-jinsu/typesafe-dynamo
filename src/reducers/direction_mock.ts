import { MockReducer } from "../types/reducer";
import { DirectionReducer } from "./direction";

export type MockDirectionReducer = MockReducer<DirectionReducer, "direction">;

export function mockDirectionReducer(...[params]: Parameters<MockDirectionReducer>): ReturnType<MockDirectionReducer> {
  return () => ({
    direction: [params],
  });
}
