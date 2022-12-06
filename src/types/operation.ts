import { DynamoDB } from "aws-sdk";
import { InputList } from "./input_list";
import { Query } from "./query";

export type OperationOption = {
  toDateString?: (value: Date) => string;
  fromDateString?: (value: string) => Date;
};

export type OperationProps = [client: DynamoDB.DocumentClient, name: string, option?: OperationOption];

export type Operation<Builder, Input extends InputList, Result> = (query: Query<Builder, Input>) => Promise<Result>;
