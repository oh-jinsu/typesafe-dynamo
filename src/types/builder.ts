import { InputList } from "./input_list";
import { EveryReducerSlice, MockBuilderResult } from "./reducer";
import { Operation } from "./operation";

/**
 * A argument type of the each operation function.
 *
 * The first generic parameter `T` should be a type of the argument builders, so that users can use them.
 * The second generic paramter `U` should be one of the input types,
 * so that users can even use still unsupported features of input types as default.
 */
export type Builder<T, U extends InputList> = (reducers: T) => (Partial<U> | EveryReducerSlice<U, keyof U>)[];

export type MockBuilderIntepreter<T> = T extends Operation<infer Builder, any, infer Result>
  ? (implement: (params: MockBuilderResult<Builder>) => Result) => (...[builder]: Parameters<T>) => Promise<Result>
  : never;
