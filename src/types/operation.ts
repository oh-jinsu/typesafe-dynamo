import { DynamoDB } from "aws-sdk";
import { InputList } from "./input_list";
import { Builder } from "./builder";

export type OperationOption<DateFormat = string> = DateFormatOption<DateFormat> & (HardOperationOption | SoftOperationOption);

export type DateFormatOption<DateFormat = string> = {
  dateFormat?: {
    toDate: (value: Date) => DateFormat;
    validateDate: (value: unknown) => boolean;
    fromDate: (value: DateFormat) => Date;
  };
};

export type HardOperationOption = {
  soft: false;
};

export type SoftOperationOption = {
  soft: true;
  deleteDateColumn: string;
};

export type OperationProps = [client: DynamoDB.DocumentClient, name: string, option?: OperationOption];

export type Operation<T extends Record<string, any>, Input extends InputList, Result> = (builder: Builder<T, Input>) => Promise<Result>;
