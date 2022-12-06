import { InputList } from "./input_list";

/**
 * Return the specific entry of the item input types.
 * It is possible to refer previous result by [`prev`] which may contain another properties in input types.
 */
export type ReducerSlice<T extends InputList, U extends keyof T> = (prev: Partial<T>) => Pick<T, U>;

/**
 * Iterate every possible reducer slices.
 */
export type EveryReducerSlice<T, U> = T extends InputList ? (U extends keyof T ? ReducerSlice<T, U> : never) : never;
