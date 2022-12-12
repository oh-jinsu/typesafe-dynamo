import {
  getConstructor,
  GetOperation,
  queryConstructor,
  QueryOperation,
  scanConstructor,
  ScanOperation,
  putConstructor,
  PutOperation,
  updateConstructor,
  UpdateOperation,
  removeConstructor,
  RemoveOperation,
} from "./operations";

import { OperationProps } from "./types/operation";

export * from "./operations";

export type Operations<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  get: GetOperation<Schema, PK, SK>;
  query: QueryOperation<Schema, PK, SK>;
  scan: ScanOperation<Schema, PK, SK>;
  put: PutOperation<Schema>;
  update: UpdateOperation<Schema, PK, SK>;
  remove: RemoveOperation<Schema, PK, SK>;
};

/**
 * Provide type-safe query operations for [`DynamoDB.DocumentClient`].
 * The first generic parameter `Schema` receives a type, interface or class that represent the schema of table.
 * The second generic parameter `PK` receives a `keyof Schema` as the partion key.
 * The third generic parameter `SK` receives a `keyof Schema` as the sort key. The last one can be ignored.
 */
export default function typesafe<Schema, PK extends keyof Schema, SK extends keyof Schema = never>(...props: OperationProps): Operations<Schema, PK, SK> {
  return {
    get: getConstructor<Schema, PK, SK>(...props),
    query: queryConstructor<Schema, PK, SK>(...props),
    scan: scanConstructor<Schema, PK, SK>(...props),
    put: putConstructor<Schema>(...props),
    update: updateConstructor<Schema, PK, SK>(...props),
    remove: removeConstructor<Schema, PK, SK>(...props),
  };
}
