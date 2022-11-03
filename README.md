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

interface User {
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

Or you can even use some of features of this library.

```ts
const result = await user.scan(({ limit }) => [
    {
        FilterExpression: "age >= 25",
    },
    limit(3),
]);
```