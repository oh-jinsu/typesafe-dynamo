import { DynamoDB } from "aws-sdk";
import { usefulObjectMapper } from "./mappers/useful";
import { keyConstructor } from "./reducers/key";
import { conditionConstructor } from "./reducers/condition";
import { filterConstructor } from "./reducers/filter";
import { selectConstructor } from "./reducers/select";
import { indexNameConstructor } from "./reducers/index_name";
import { limitConstructor } from "./reducers/limit";
import { directionConstructor } from "./reducers/direction";
import { valuesConstructor } from "./reducers/values";
import { replaceConstructor } from "./reducers/replace";
import { Query } from "./types/query";
import { GetBuilder, PutBuilder, QueryBuilder, RemoveBuilder, ScanBuilder, UpdateBuilder } from "./types/builders";
import { GetOperation, PutOperation, QueryOperation, RemoveOperation, ScanOperation, UpdateOperation } from "./types/operations";

export type Options = {
  toDateString?: (value: Date) => string;
  fromDateString?: (value: string) => Date;
};

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
export default function typesafe<Schema, PK extends keyof Schema, SK extends keyof Schema = never>(
  client: DynamoDB.DocumentClient,
  name: string,
  options?: Options,
): Operations<Schema, PK, SK> {
  const toDateString = options?.toDateString || ((value) => value.toISOString());

  const fromDateString = options?.fromDateString || ((value) => new Date(value));

  const tableNameSlice = {
    TableName: name,
  } as any;

  /**
   * Calculate reducers that an user has set.
   *
   * Return the one of input types,
   * so that it can fit with the paramenter of the each operation from `DynamoDB.Client`.
   */
  const reduce = (pre: any, cur: any) => {
    if (typeof cur === "function") {
      return { ...pre, ...cur(pre) };
    }

    return { ...pre, ...cur };
  };

  /**
   * A wrapper function for the `DynamoDB.DocumentClient.get`.
   *
   * Find an entity by its key.
   * Return as the type of the entity that is provided from the schema.
   *
   * ## Example
   * ```
   * const result = await user.get(({ key, select }) => [
   *   key({
   *     id: 1,
   *   }),
   *   select("id", "name"),
   * ]);
   *
   * ```
   */
  const get = async (query: Query<GetBuilder<Schema, PK, SK>, DynamoDB.GetItemInput>): Promise<Schema | undefined> => {
    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    const select = selectConstructor<Schema>();

    const { Item } = await client
      .get(
        query({
          key,
          select,
        }).reduce(reduce, tableNameSlice),
      )
      .promise();

    if (!Item) {
      return;
    }

    return usefulObjectMapper(fromDateString)(Item);
  };

  /**
   * A wrapper function for the `DynamoDB.DocumentClient.query`.
   *
   * Find entities by the partion key and the sort key.
   * Return an array as the type of the entities that is provided from the schema.
   *
   * ## Example
   * ```
   * const result = await user.query(({ condition }) => [
   *   condition({
   *     age: 25,
   *   }),
   * ]);
   *
   * ```
   */
  const query = async (query: Query<QueryBuilder<Schema, PK, SK>, DynamoDB.QueryInput>): Promise<Schema[]> => {
    const condition = conditionConstructor<Schema, PK, SK>({ toDateString });

    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const index = indexNameConstructor();

    const limit = limitConstructor();

    const direction = directionConstructor();

    const { Items } = await client
      .query(
        query({
          index,
          condition,
          filter,
          select,
          limit,
          direction,
        }).reduce(reduce, tableNameSlice),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };

  /**
   * A wrapper function for the `DynamoDB.DocumentClient.scan`.
   *
   * Find entities by the fields except the partion key.
   * Return an array as the type of the entities that is provided from the schema.
   *
   * ## Example
   * ```
   * const result = await user.scan(({ filter, limit }) => [
   *   filter({
   *     age: 25,
   *   }),
   *   limit(1),
   * ]);
   *
   * ```
   */
  const scan = async (query: Query<ScanBuilder<Schema, PK>, DynamoDB.ScanInput>): Promise<Schema[]> => {
    const filter = filterConstructor<Schema, PK>({ toDateString });

    const select = selectConstructor<Schema>();

    const index = indexNameConstructor();

    const limit = limitConstructor();

    const { Items } = await client
      .scan(
        query({
          index,
          filter,
          select,
          limit,
        }).reduce(reduce, tableNameSlice),
      )
      .promise();

    return usefulObjectMapper(fromDateString)(Items);
  };

  /**
   * A wrapper function for the `DynamoDB.DocumentClient.put`.
   *
   * Put an entity with values.
   * Of course it works in the same way as [`DynamoDB.DocumentClient`] does,
   * for instance, it overrides the entity when it already exists with the same partion key.
   *
   * ## Example
   * ```
   * await user.put(({ values }) => [
   *   values({
   *     id: 1,
   *     name: "jinsu",
   *   }),
   * ]);
   *
   * ```
   */
  const put = async (query: Query<PutBuilder<Schema>, DynamoDB.PutItemInput>): Promise<Schema> => {
    const values = valuesConstructor<Schema>({ toDateString });

    const params = query({
      values,
    }).reduce(reduce, tableNameSlice) as DynamoDB.PutItemInput;

    await client.put(params).promise();

    return usefulObjectMapper(fromDateString)(params.Item);
  };
  /**
   * A wrapper function for the `DynamoDB.DocumentClient.update`.
   *
   * Must use `replace` from builders in order to update fields in the entity.
   *
   * ## Example
   * ```
   * const result = await user.update(({ key, replace }) => [
   *   key({
   *     id: 1,
   *   })
   *   replace({
   *     name: "Jinsu",
   *   }),
   * ]);
   *
   * ```
   */
  const update = async (query: Query<UpdateBuilder<Schema, PK, SK>, DynamoDB.UpdateItemInput>): Promise<Schema> => {
    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    const replace = replaceConstructor<Schema, PK, SK>({ toDateString });

    const params = query({
      key,
      replace,
    }).reduce(reduce, {
      ...tableNameSlice,
      ReturnValues: "ALL_NEW",
    }) as DynamoDB.UpdateItemInput;

    const { Attributes } = await client.update(params).promise();

    return usefulObjectMapper(fromDateString)(Attributes);
  };

  /**
   * A wrapper function for the `DynamoDB.DocumentClient.delete`.
   *
   * Remove an entity by its partion key.
   *
   * ## Example
   * ```
   * const result = await user.remove(({ key }) => [
   *   key({
   *     id: 1,
   *   }),
   * ]);
   *
   * ```
   */
  const remove = async (query: Query<RemoveBuilder<Schema, PK, SK>, DynamoDB.DeleteItemInput>): Promise<void> => {
    const key = keyConstructor<Schema, PK, SK>({ toDateString });

    await client
      .delete(
        query({
          key,
        }).reduce(reduce, tableNameSlice),
      )
      .promise();
  };

  return {
    get,
    query,
    scan,
    put,
    update,
    remove,
  };
}
