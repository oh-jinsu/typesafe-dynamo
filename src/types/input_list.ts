import { DynamoDB } from "aws-sdk";

/**
 * Every input types of [`DynamoDB`]
 */
export type InputList =
  | DynamoDB.GetItemInput
  | DynamoDB.QueryInput
  | DynamoDB.ScanInput
  | DynamoDB.PutItemInput
  | DynamoDB.UpdateItemInput
  | DynamoDB.DeleteItemInput;
