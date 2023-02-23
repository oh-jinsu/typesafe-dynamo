import { InputList } from "./input_list";

/**
 * Return the specific entry of the item input types.
 * It is possible to refer previous result by [`prev`] which may contain another properties in input types.
 */
export type ReducerSlice<T extends InputList, U extends keyof T> = (prev: Partial<T>) => Pick<T, U>;

export type MockReducerSlice<T extends string | number | symbol, U> = (prev: {
  [x in T]?: U;
}) => {
  [x in T]: U;
};

export type AnyReducer = (...params: any) => (prev: any) => any;

export type MockReducer<T extends AnyReducer, U extends string | number | symbol> = (...params: Parameters<T>) => MockReducerSlice<U, Parameters<T>>;

export type MockSpreadReducer<T extends AnyReducer, U extends string> = (...params: Parameters<T>) => MockReducerSlice<U, Parameters<T>>;

export type ResultOfMockReducer<T> = T extends (...args: any) => MockReducerSlice<any, infer U> ? U : never;

export type MockBuilderResult<T extends Record<string, AnyReducer>> = {
  [K in keyof T]: ResultOfMockReducer<MockReducer<T[K], K>>;
};

/**
 * Iterate every possible reducer slices.
 */
export type EveryReducerSlice<T, U> = T extends InputList ? (U extends keyof T ? ReducerSlice<T, U> : never) : never;
