import { DynamoDB } from "aws-sdk";
import { InputList } from "./input_list";
import { Builder } from "./builder";

export type OperationOption = {
  toDateString?: (value: Date) => string;
  fromDateString?: (value: string) => Date;
} & (HardOperationOption | SoftOperationOption<string>);

export type HardOperationOption = {
  soft: false;
};

export type SoftOperationOption<DeleteDateColumn extends string> = {
  soft: true;
  deleteDateColumn: DeleteDateColumn;
};

export type OperationProps = [client: DynamoDB.DocumentClient, name: string, option?: OperationOption];

export type Operation<T extends Record<string, any>, Input extends InputList, Result> = (builder: Builder<T, Input>) => Promise<Result>;
