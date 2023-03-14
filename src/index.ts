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
import { GSIManifest } from "./types/gsi";

import { OperationProps } from "./types/operation";

export * from "./operations";

export * from "./mappers/puttable";

export type Operations<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIManifest<Schema>> = {
  get: GetOperation<Schema, PK, SK>;
  query: QueryOperation<Schema, PK, SK, GSI>;
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
export default function typesafe<Schema, PK extends keyof Schema, SK extends keyof Schema = never, GSI extends GSIManifest<Schema> = Record<string, never>>(
  ...props: OperationProps
): Operations<Schema, PK, SK, GSI> {
  return {
    get: getConstructor(...props),
    query: queryConstructor(...props),
    scan: scanConstructor(...props),
    put: putConstructor(...props),
    update: updateConstructor(...props),
    remove: removeConstructor(...props),
  };
}
