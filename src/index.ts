import { DynamoDB } from "aws-sdk";

type InputList = DynamoDB.GetItemInput | DynamoDB.QueryInput | DynamoDB.ScanInput | DynamoDB.PutItemInput | DynamoDB.UpdateItemInput | DynamoDB.DeleteItemInput;

/**
 * Default key names of an update date column and a create date column.
 */
const DATE_KEY_LIST = ["updatedAt", "createdAt"] as const;

/**
 * Default type of an update date column and a create date column.
 */
type DateKeyList = typeof DATE_KEY_LIST[number];

/**
 * Provide type-safe query operations for [`DynamoDB.DocumentClient`].
 * The first generic parameter `T` receives a type, interface or class that represent the schema of table.
 * The second generic parameter `U` receives a `keyof T` as the partion key.
 */
const typesafe = <Schema, PK extends keyof Schema, SK extends keyof Schema | never = never>(client: DynamoDB.DocumentClient, name: string) => {
  /**
   * Return the specific entry of the item [`DynamoDB.*ItemInput`].
   * It is possible to refer previous result by [`prev`] which may contain another properties in [`DynamoDB.*ItemInput`]
   */
  type ReducerSlice<T extends InputList, U extends keyof T> = (prev: Partial<T>) => Pick<T, U>;

  /**
   * Pass the entry of the partion key.
   *
   * ## Example
   * ```
   * const result = await user.get(({ key }) => [
   *   key({
   *     id: 1,
   *   }),
   * ]);
   *
   * ```
   */
  const key =
    (params: Pick<Schema, PK>): ReducerSlice<DynamoDB.GetItemInput | DynamoDB.UpdateItemInput | DynamoDB.DeleteItemInput, "Key"> =>
    () => ({
      Key: params as any,
    });

  /**
   * Pass the entry of the partion key or the sort key.
   * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
   
   * ## Example
   * ```
   * const result = await user.query(({ condition }) => [
   *   condition({
   *     id: 1,
   *     lastName: "Oh",
   *   }),
   * ]);
   *
   * ```
   */
  const condition =
    (
      params: Partial<Pick<Schema, PK | SK>>,
    ): ReducerSlice<DynamoDB.QueryInput, "KeyConditionExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues"> =>
    ({ KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      KeyConditionExpression: `${KeyConditionExpression ? `${KeyConditionExpression} and ` : ""}${Object.keys(params)
        .map((key) => `#${key} = :${key}`)
        .join(" and ")}`,
      ExpressionAttributeNames: Object.keys(params).reduce(
        (pre, cur) => ({
          ...pre,
          [`#${cur}`]: cur,
        }),
        ExpressionAttributeNames || {},
      ),
      ExpressionAttributeValues: Object.entries(params).reduce(
        (pre, [key, value]) => ({
          ...pre,
          [`:${key}`]: value,
        }),
        (ExpressionAttributeValues as any) || {},
      ),
    });

  /**
   * Filter results with conditions.
   * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
   *
   * ## Example
   * ```
   * const result = await user.scan(({ filter }) => [
   *   filter({
   *     name: "jinsu",
   *   }),
   * ]);
   *
   * ```
   */
  const filter =
    (
      params: Partial<Omit<Schema, PK>>,
    ): ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "FilterExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues"> =>
    ({ FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      FilterExpression: `${FilterExpression ? `${FilterExpression} and ` : ""}${Object.keys(params)
        .map((key) => `#${key} = :${key}`)
        .join(" and ")}`,
      ExpressionAttributeNames: Object.keys(params).reduce(
        (pre, cur) => ({
          ...pre,
          [`#${cur}`]: cur,
        }),
        ExpressionAttributeNames || {},
      ),
      ExpressionAttributeValues: Object.entries(params).reduce(
        (pre, [key, value]) => ({
          ...pre,
          [`:${key}`]: value,
        }),
        (ExpressionAttributeValues as any) || {},
      ),
    });

  /**
   * Select properties of the entity to read.
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
  const select =
    (
      ...params: (keyof Schema)[]
    ): ReducerSlice<DynamoDB.GetItemInput | DynamoDB.QueryInput | DynamoDB.ScanInput, "ProjectionExpression" | "ExpressionAttributeNames"> =>
    ({ ProjectionExpression, ExpressionAttributeNames }) => ({
      ProjectionExpression: `${ProjectionExpression ? `${ProjectionExpression} ` : ""}${params.map((param) => `#${param.toString()}`).join(", ")}`,
      ExpressionAttributeNames: params.reduce(
        (pre, cur) => ({
          ...pre,
          [`#${cur.toString()}`]: cur.toString(),
        }),
        ExpressionAttributeNames || {},
      ),
    });

  /**
   * Set the index of the schema.
   *
   * ## Example
   * ```
   * const result = await user.query(({ condition, index }) => [
   *   index("NameAndAgeIndex")
   *   condition({
   *     age: 25,
   *   }),
   * ]);
   *
   * ```
   */
  const index =
    (params: string): ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "IndexName"> =>
    () => ({
      IndexName: params,
    });

  /**
   * Limit the maximum count of result elements.
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
  const limit =
    (params: number): ReducerSlice<DynamoDB.QueryInput | DynamoDB.ScanInput, "Limit"> =>
    () => ({
      Limit: params,
    });

  /**
   * Set the direction of quering.
   *
   * ## Example
   * ```
   * const result = await user.query(({ condition, direction }) => [
   *   condition({
   *     id: 1,
   *     lastName: "Oh",
   *   }),
   *   direction("FORWARD")
   * ]);
   *
   * ```
   */
  const direction =
    (params: "FORWARD" | "BACKWARD"): ReducerSlice<DynamoDB.QueryInput, "ScanIndexForward"> =>
    () => ({
      ScanIndexForward: params === "FORWARD",
    });

  /**
   * Pass values incuding the partion key of the entity.
   * It automatically adds `updatedAt` and `createdAt` properties.
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
  const values =
    (params: Omit<Schema, DateKeyList>): ReducerSlice<DynamoDB.PutItemInput, "Item"> =>
    ({ Item }) => ({
      Item: {
        ...(Item ?? {}),
        ...(params as any),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    });

  /**
   * Replace values of the entity.
   * It automatically update the `updatedAt` property.
   * Note that it is not needed to use [`ExpressionAttributeNames`] and [`ExpressionAttributeValues`], because it does automatically.
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
  const replace =
    (
      params: Partial<Omit<Schema, PK | DateKeyList>>,
    ): ReducerSlice<DynamoDB.UpdateItemInput, "UpdateExpression" | "ExpressionAttributeNames" | "ExpressionAttributeValues"> =>
    ({ UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }) => ({
      UpdateExpression: `${UpdateExpression ? `${UpdateExpression},` : "set #updatedAt = :updatedAt,"} ${Object.keys(params)
        .map((key) => `#${key} = :${key}`)
        .join(", ")}`,
      ExpressionAttributeNames: Object.keys(params).reduce(
        (pre, cur) => ({
          ...pre,
          [`#${cur}`]: cur,
          "#updatedAt": "updatedAt",
        }),
        ExpressionAttributeNames || {},
      ),
      ExpressionAttributeValues: Object.entries(params).reduce(
        (pre, [key, value]) => ({
          ...pre,
          [`:${key}`]: value,
          ":updatedAt": new Date().toISOString() as any,
        }),
        (ExpressionAttributeValues as any) || {},
      ),
    });

  /**
   * Iterate every possible input slices.
   */
  type EverySlice<T, U> = T extends InputList ? (U extends keyof T ? ReducerSlice<T, U> : never) : never;

  /**
   * A argument type of the each operation function.
   *
   * The first generic parameter `T` should be a type of the argument builders, so that users can use them.
   * The second generic paramter `U` should be one of the [`DynamoDB.*ItemInput`] types,
   * so that users can even use still unsupported features of [`DynamoDB.*ItemInput`] as default.
   */
  type Query<T, U extends InputList> = (builders: T) => (Partial<U> | EverySlice<U, keyof U>)[];

  const getBuilder = {
    key,
    select,
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
  const get = async (query: Query<typeof getBuilder, DynamoDB.GetItemInput>): Promise<Schema | undefined> => {
    const { Item } = await client.get(reduce(query, getBuilder)).promise();

    return Item as Schema;
  };

  const queryBuilder = {
    index,
    condition,
    filter,
    select,
    limit,
    direction,
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
   *     name: "jinsu",
   *   }),
   * ]);
   *
   * ```
   */
  const query = async (query: Query<typeof queryBuilder, DynamoDB.QueryInput>): Promise<Schema[]> => {
    const { Items } = await client.query(reduce(query, queryBuilder)).promise();

    if (!Items) {
      return [];
    }

    return Items as Schema[];
  };

  const scanBuilder = {
    index,
    filter,
    select,
    limit,
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
  const scan = async (query: Query<typeof scanBuilder, DynamoDB.ScanInput>): Promise<Schema[]> => {
    const { Items } = await client.scan(reduce(query, scanBuilder)).promise();

    if (!Items) {
      return [];
    }

    return Items as Schema[];
  };

  const putBuilder = {
    values,
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
  const put = async (query: Query<typeof putBuilder, DynamoDB.PutItemInput>): Promise<void> => {
    await client.put(reduce(query, putBuilder)).promise();
  };

  const updateBuilder = {
    key,
    replace,
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
  const update = async (query: Query<typeof updateBuilder, DynamoDB.UpdateItemInput>): Promise<void> => {
    await client.update(reduce(query, updateBuilder)).promise();
  };

  const removeBuilder = {
    key,
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
  const remove = async (query: Query<typeof removeBuilder, DynamoDB.DeleteItemInput>): Promise<void> => {
    await client.delete(reduce(query, updateBuilder)).promise();
  };

  /**
   * Calculate reducers that an user has set.
   *
   * Return the one of [`DynamoDB.*ItemInput`],
   * so that it can fit with the paramenter of the each operation from `DynamoDB.Client`.
   */
  const reduce = <T, U extends InputList>(query: Query<T, U>, builders: T) =>
    query(builders).reduce(
      (pre, cur) => {
        if (typeof cur === "function") {
          return { ...pre, ...cur(pre) };
        }

        return { ...pre, ...cur };
      },
      {
        TableName: name,
      } as any,
    );

  return {
    get,
    query,
    scan,
    put,
    update,
    remove,
  };
};

export default typesafe;
