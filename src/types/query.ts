import { InputList } from "./input_list";
import { EveryReducerSlice } from "./reducer";

/**
 * A argument type of the each operation function.
 *
 * The first generic parameter `T` should be a type of the argument builders, so that users can use them.
 * The second generic paramter `U` should be one of the input types,
 * so that users can even use still unsupported features of input types as default.
 */
export type Query<T, U extends InputList> = (builders: T) => (Partial<U> | EveryReducerSlice<U, keyof U>)[];
