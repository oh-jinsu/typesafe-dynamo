import { getConstructor, GetOperation } from "./operations";
import { queryConstructor, QueryOperation } from "./operations/query";
import { scanConstructor, ScanOperation } from "./operations/scan";
import { putConstructor, PutOperation } from "./operations/put";
import { updateConstructor, UpdateOperation } from "./operations/update";
import { removeConstructor, RemoveOperation } from "./operations/remove";
import { OperationProps } from "./types/operation";

export * from "./operations";

export type Operations<Schema, PK extends keyof Schema, SK extends keyof Schema> = {
  get: GetOperation<Schema, PK, SK>;
  query: QueryOperation<Schema, PK, SK>;
  scan: ScanOperation<Schema, PK>;
  put: PutOperation<Schema>;
  update: UpdateOperation<Schema, PK, SK>;
  remove: RemoveOperation<Schema, PK, SK>;
};

/**
 * Provide type-safe query operations for [`DynamoDB.DocumentClient`].
 * The first generic parameter `T` receives a type, interface or class that represent the schema of table.
 * The second generic parameter `U` receives a `keyof T` as the partion key.
 */
export default function typesafe<Schema, PK extends keyof Schema, SK extends keyof Schema = never>(...props: OperationProps): Operations<Schema, PK, SK> {
  return {
    get: getConstructor<Schema, PK, SK>(...props),
    query: queryConstructor<Schema, PK, SK>(...props),
    scan: scanConstructor<Schema, PK>(...props),
    put: putConstructor<Schema>(...props),
    update: updateConstructor<Schema, PK, SK>(...props),
    remove: removeConstructor<Schema, PK, SK>(...props),
  };
}
