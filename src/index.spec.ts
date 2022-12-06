import { DynamoDB } from "aws-sdk";
import typesafe from ".";

describe("Get operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const schema = typesafe<User, "id", "name">(client, "test");

  test("should return an object", async () => {
    const result = await schema.get(({ key }) => [
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
    const result = await schema.get(({ key }) => [
      key({
        id: "-999",
        name: "static-user",
      }),
    ]);

    expect(result).toBeUndefined();
  });

  test("should support raw request", async () => {
    const result = await schema.get(() => [
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

describe("Query operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const schema = typesafe<User, "id", "name">(client, "test");

  test("should return objects", async () => {
    const result = await schema.query(({ condition }) => [
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
    const result = await schema.query(({ condition }) => [
      condition({
        id: "-999",
        name: "static-user",
      }),
    ]);

    expect(result.length).toBe(0);
  });
});

describe("Scan operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const schema = typesafe<User, "id", "name">(client, "test");

  test("should return objects", async () => {
    const result = await schema.scan(({ filter }) => [
      filter({
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

describe("Put/Update/Remove operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const schema = typesafe<User, "id", "name">(client, "test");

  const id = `id${new Date().getTime()}`;

  test("should put an object", async () => {
    const result = await schema.put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.age).toBe(25);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test("should update an object", async () => {
    const result = await schema.update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        age: 23,
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.age).toBe(23);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test("should remove an object", async () => {
    await schema.remove(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    const result = await schema.get(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    expect(result).toBeUndefined();
  });
});
