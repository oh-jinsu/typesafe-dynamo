import { OperationOption } from "../types/operation";

export const defaultDateValidator = (value: unknown) =>
  typeof value === "string" && /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/.test(value);

export const defaultToDate = (value: Date) => value.toISOString();

export const defaultFromDate = (value: any) => new Date(value);

export const getDateMappers = (option?: OperationOption) => {
  const toDate = option?.dateFormat?.toDate ?? defaultToDate;

  const fromDate = option?.dateFormat?.fromDate ?? defaultFromDate;

  const validateDate = option?.dateFormat?.validateDate ?? defaultDateValidator;

  return {
    toDate,
    fromDate,
    validateDate,
  };
};
