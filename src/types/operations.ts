import { DynamoDB } from "aws-sdk";
import { GetBuilder, PutBuilder, QueryBuilder, RemoveBuilder, ScanBuilder, UpdateBuilder } from "./builders";
import { Query } from "./query";

export type GetOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  query: Query<GetBuilder<Schema, PK, SK>, DynamoDB.GetItemInput>,
) => Promise<Schema | undefined>;

export type QueryOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  query: Query<QueryBuilder<Schema, PK, SK>, DynamoDB.QueryInput>,
) => Promise<Schema[]>;

export type ScanOperation<Schema, PK extends keyof Schema> = (query: Query<ScanBuilder<Schema, PK>, DynamoDB.ScanInput>) => Promise<Schema[]>;

export type PutOperation<Schema> = (query: Query<PutBuilder<Schema>, DynamoDB.PutItemInput>) => Promise<Schema>;

export type UpdateOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  query: Query<UpdateBuilder<Schema, PK, SK>, DynamoDB.UpdateItemInput>,
) => Promise<Schema>;

export type RemoveOperation<Schema, PK extends keyof Schema, SK extends keyof Schema> = (
  query: Query<RemoveBuilder<Schema, PK, SK>, DynamoDB.DeleteItemInput>,
) => Promise<void>;
