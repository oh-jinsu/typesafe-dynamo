import { DynamoDB } from "aws-sdk";
import { getConstructor } from "./get";
import { putConstructor } from "./put";
import { removeConstructor } from "./remove";

describe("GetOperation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const get = getConstructor<User, "id", "name">(client, "test");

  test("should return an object", async () => {
    const result = await get(({ key }) => [
      key({
        id: "0",
        name: "static-user",
      }),
    ]);

    expect(result).toStrictEqual({
      id: "0",
      name: "static-user",
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
    });
  });

  test("should not return an object", async () => {
    const result = await get(({ key }) => [
      key({
        id: "-999",
        name: "static-user",
      }),
    ]);

    expect(result).toBeUndefined();
  });

  test("should support raw request", async () => {
    const result = await get(() => [
      {
        Key: {
          id: "0",
          name: "static-user",
        } as any,
      },
    ]);

    expect(result).toStrictEqual({
      id: "0",
      name: "static-user",
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
    });
  });
});

describe("Soft get operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const get = getConstructor<User, "id", "name">(client, "test", { soft: true });

  const put = putConstructor<User>(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test", { soft: true });

  const id = `id${new Date().getTime()}`;

  test("should remove an object", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
      }),
    ]);

    await remove(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    const result = await get(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    expect(result).toBeUndefined();
  });
});
