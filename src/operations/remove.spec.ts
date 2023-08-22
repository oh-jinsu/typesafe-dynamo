import { DynamoDB } from "aws-sdk";
import { getConstructor } from "./get";
import { putConstructor } from "./put";
import { removeConstructor } from "./remove";

describe("Remove operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const get = getConstructor<User, "id", "name">(client, "test");

  const put = putConstructor<User>(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test");

  const id = `id${new Date().getTime()}`;

  test("should remove an object", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
        createdAt: new Date(),
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

describe("Soft remove operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const get = getConstructor<User, "id", "name">(client, "test", { soft: true, deleteDateColumn: "deletedAt" });

  const put = putConstructor<User>(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test", { soft: true, deleteDateColumn: "deletedAt" });

  const id = `id${new Date().getTime()}`;

  test("should remove an object", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
        createdAt: new Date(),
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
