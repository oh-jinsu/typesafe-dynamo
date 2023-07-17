import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk";

export const withError = async <T>(fn: () => Promise<PromiseResult<T, AWSError>>): Promise<T> => {
  const result = await fn();

  const { error } = result.$response;

  if (error) {
    throw error;
  }

  return result;
};
