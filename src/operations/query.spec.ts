import { DynamoDB } from "aws-sdk";
import { putConstructor } from "./put";
import { queryConstructor } from "./query";
import { removeConstructor } from "./remove";

describe("Query operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const query = queryConstructor<
    User,
    "id",
    "name",
    {
      "name-createdAt-index": ["name", "createdAt"];
    }
  >(client, "test");

  test("should return objects", async () => {
    const result = await query(({ condition }) => [
      condition({
        id: "0",
        name: "static-user",
      }),
    ]);

    expect(result).toStrictEqual([
      {
        id: "0",
        name: "static-user",
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
      },
    ]);
  });

  test("should not return objects", async () => {
    const result = await query(({ condition }) => [
      condition({
        id: "-999",
        name: "static-user",
      }),
    ]);

    expect(result.length).toBe(0);
  });

  test("should paginate", async () => {
    const put = putConstructor<User>(client, "test");

    const id = `id${new Date().getTime()}`;

    const generateUser = (name: string) =>
      put(({ values }) => [
        values({
          id,
          name,
        }),
      ]);

    await Promise.all([generateUser("a"), generateUser("b"), generateUser("c")]);

    const items = await query(({ condition, limit }) => [
      condition({
        id,
      }),
      limit(1),
    ]);

    const last = items[items.length - 1];

    const result = await query(({ condition, nextOf }) => [
      condition({
        id,
      }),
      nextOf({
        id: last.id,
        name: last.name,
      }),
    ]);

    expect(result.length).toBe(2);
  });

  test("should return objects by index", async () => {
    const result = await query(({ indexName }) => [
      indexName("name-createdAt-index").condition({
        name: "static-user",
      }),
    ]);

    expect(result).toStrictEqual([
      {
        id: "0",
        name: "static-user",
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
      },
    ]);
  });
});

describe("Soft query operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const query = queryConstructor<User, "id", "name">(client, "test", { soft: true });

  const put = putConstructor<User>(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test", { soft: true });

  test("should remove an object", async () => {
    const id = `id${new Date().getTime()}`;

    const name = "generated-user";

    await put(({ values }) => [
      values({
        id,
        name,
      }),
    ]);

    await remove(({ key }) => [
      key({
        id,
        name,
      }),
    ]);

    const result = await query(({ condition }) => [
      condition({
        id,
      }),
    ]);

    expect(result).toStrictEqual([]);
  });
});
