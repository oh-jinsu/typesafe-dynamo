# typesafe-dynamo

Provide type-safe query operations for AWS DynamoDB.

## Quick start

```sh
npm i --save typesafe-dynamo
```

## Example

```ts
import { DynamoDB } from "aws-sdk";
import typesafe from "typesafe-dynamo";

const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
});

type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id">(client, "user");

await table.put(({ values }) => [
    values({
        id: "0000",
        name: "jinsu",
        age: 25,
    }),
]);

const result = await table.get(({ key }) => [
    key({
        id: "0000",
    }),
]);

console.log(result);

```

Don't worry about features that are not supported yet. You can still use the types from `aws-sdk`.

```ts
const result = await user.scan(() => [{
    FilterExpression: "age >= 25",
}]);
```

Or you can even use some of the features of this library.

```ts
const result = await user.scan(({ select }) => [
    {
        FilterExpression: "age >= 25",
    },
    select("name"),
]);
```

## How to define your own table

```ts
function typesafe<Schema, PK, SK, GSI>(...props: OperationProps)
```

This function defines the type of your table. `Schema` and `PK` are required generic type parameters. `SK` and `GSI` are optional. Last, you should put your `DynamoDB.DocumentClient` and your table name to the function parameter.

### Schema

```ts
type UserSchema = {
    id: string;
    name: string;
    age: int;
    updatedAt: Date;
    createdAt: Date;
}
```
```ts
const table = typesafe<UserSchema, ...>(...)
```

You can put anything to the `Schema` type parameter. This type defines the columns and their data types in your table.

This library automatically adds `updatedAt` to your object putting. Even if your `Schema` does not have the properties.

### PK

```ts
type PK = "id"
```
```ts
const table = typesafe<UserSchema, PK, ...>(...)
```

`PK` should be one of the keys of the `Schema`. It defines the partition key of your DynamoDB table.

### SK

```ts
type SK = "age"
```
```ts
const table = typesafe<UserSchema, PK, SK>(...)
```

`SK` should be one of the keys of the `Schema`. It defines the sort key of your DynamoDB table.

### GSI
```ts
type GSI = {
    "idNameIndex": ["id", "name"]
}
```
```ts
const table = typesafe<UserSchema, PK, SK, GSI>(...)
```
`GSI` should extend `GSIList<Schema>`. The keys of the `GSI` type parameter should be each name of your GSI table. And its value should be an array that has a `PK` element and an `SK` element of your GSI table.

### OperationProps
```ts
type OperationProps = [client: DynamoDB.DocumentClient, name: string, option?: OperationOption];

```
It's the type of the parameters in `typesafe` function. you should put your `DynamoDB.DocumentClient` and your table name like below:
```ts
const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",,
})

const name = "user-table"

const table = typesafe<UserSchema, PK, SK, GSI>(client, name)
```

You can configure some options too. Check out the `OperationOption` type.

```ts
export type OperationOption = {
  soft?: boolean;
  toDateString?: (value: Date) => string;
  fromDateString?: (value: string) => Date;
}
```

If `soft` is true, the delete operation won't delete an item in your DynamoDB table. Of course you can not find the item by other operations though.

Also, you can configure how your `Date` type field is saved in your DynamoDB table by `toDateString` and `fromDateString` parameters.  
**Note that these parameters won't work for now because the internal date validator allows only ISO8601 now. I'll fix it soon.**

Check out an example using options:
```ts
const table = typesafe<UserSchema, PK, SK, GSI>(client, name, { soft: true })
```

## Operations
After a table is defined, you can use operation methods from it.
```ts
type Operations<Schema, PK extends keyof Schema, SK extends keyof Schema, GSI extends GSIList<Schema>> = {
  get: GetOperation<Schema, PK, SK>;
  query: QueryOperation<Schema, PK, SK, GSI>;
  scan: ScanOperation<Schema, PK, SK>;
  put: PutOperation<Schema>;
  update: UpdateOperation<Schema, PK, SK>;
  remove: RemoveOperation<Schema, PK, SK>;
}
```

## GetOperation

This is a type-safe version get operation of DynamoDB. You have 2 functions by which you can manipulate parameters: `key` and `select`.

### key

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id">(client, name)

const result = await table.get(({ key }) => [
    key({ id: "01" })
])
```

Like above, every function is given through the parameter of the function parameter of each operation.

### select

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id">(client, name)

const result = await table.get(({ key, select }) => [
    key({ id: "01" }),
    select("age", "id")
])
```

Sometimes you may want to select only some of the properties from the `Schema`.

## QueryOperation

This is a type-safe version query operation of DynamoDB. You have 7 functions by which you can manipulate parameters: `condition`, `filter`, `nextOf`, `indexName`, `select`, `limit`, and `direction`. But I'll omit the `select` function here because it's just the same as the example in `GetOperation`.

### condition

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.query(({ condition }) => [
    condition({ age: 30 }),
])
```

It's going to find every user who is 30 years old.

### filter

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.query(({ condition, filter }) => [
    condition({ age: 30 }),
    filter({ name: "John" })
])
```

It's going to find every John who is 30 years old.

### nextOf

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.query(({ condition, nextOf }) => [
    condition({ age: 30 }),
    nextOf({ name: "John", age: 30 })
])
```

It's going to find every john after the 30 yo john.

### indexName

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

type GSI = {
    "nameAgeIndex": ["name", "age"]
}

const table = typesafe<User, "age", "id", GSI>(client, name)

const result = await table.query(({ indexName }) => [
    indexName("nameAgeIndex").condition({
        name: "john",
    })
])
```

It enables you to use the Global Secondary Index of your DynamoDB table.

### limit

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.query(({ condition, limit }) => [
    condition({ age: 30 }),
    limit(10)
])
```

It's going to find at most 10 users who are 30 years old.

### direction

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

type GSI = {
    "nameAgeIndex": ["name", "Age"]
}

const table = typesafe<User, "age", "id", GSI>(client, name)

const result = await table.query(({ indexName }) => [
    indexName("nameAgeIndex").condition({
        name: "john",
    }),
    indexName("nameAgeIndex").direction("BACKWORD")
])
```

It's going to find every John but from the oldest.

## ScanOperation

This is a type-safe version scan operation of DynamoDB. You have 4 functions by which you can manipulate parameters: `filter`, `nextOf`, `select`, and `limit`. But everything is just the same as with `QueryOperation`.

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.scan(({ filter }) => [
    filter({ name: "John" })
])
```

## PutOperation

This is a type-safe version scan operation of DynamoDB. You have only one function by which you can manipulate parameters: `values`.

### values

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "age", "id">(client, name)

const result = await table.put(({ values }) => [
    values({
        "id": "01",
        "name": "John",
        "age": 30,
    })
])
```

## UpdateOperation

This is a type-safe version update operation of DynamoDB. You have 2 functions by which you can manipulate parameters: `key` and `replace`. `key` is just the same as the one in the `GetOperation`. It picks an item with the `PK` and `SK` if it exists.

### replace

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id", "name">(client, name)

const result = await table.update(({ key, replace }) => [
    key({
        "id": "01",
        "name": "John",
    })
    replace({
        "age": 29,
    })
])
```

## RemoveOperation

This is a type-safe version of the delete operation of DynamoDB. You have only one function by which you can manipulate parameters: `key`. `key` is just the same as the one in the `GetOperation`.

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id", "name">(client, name)

const result = await table.remove(({ key }) => [
    key({
        "id": "01",
        "name": "John",
    })
])
```

## Errors

Operations throw `AWSError` if an internal error occurs. Use `try`-`catch`

```ts
type User = {
    id: string;
    name: string;
    age: number;
}

const table = typesafe<User, "id">(client, name)

try {
    const result = await table.get(({ key }) => [
        key({ id: "01" })
    ])
} catch (e: any) {
    if ("statusCode" in e) {
        //TODO: Error handling
    }
}

```