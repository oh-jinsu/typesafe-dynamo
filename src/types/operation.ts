import { DynamoDB } from "aws-sdk";
import { InputList } from "./input_list";
import { Builder } from "./builder";
import { AnyReducer } from "./reducer";

export type OperationOption = {
  toDateString?: (value: Date) => string;
  fromDateString?: (value: string) => Date;
};

export type OperationProps = [client: DynamoDB.DocumentClient, name: string, option?: OperationOption];

export type Operation<T extends Record<string, AnyReducer>, Input extends InputList, Result> = (builder: Builder<T, Input>) => Promise<Result>;
