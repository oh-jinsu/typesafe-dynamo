import { VALUE_OPERATOR_ALAIS } from "./extract";

export function withValueOperator(op: string): <T>(value: any) => T {
  return (value) =>
    ({
      [VALUE_OPERATOR_ALAIS]: op,
      value,
    } as any);
}

export const equalWith = withValueOperator("=");

export const notEqaulWith = withValueOperator("<>");

export const lessThan = withValueOperator("<");

export const notGreatorThan = withValueOperator("<=");

export const greaterThan = withValueOperator(">");

export const notLessThan = withValueOperator(">=");

export const or = <T>(...fn: T[]): T => fn as any;
