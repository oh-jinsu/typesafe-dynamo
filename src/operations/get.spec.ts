import { DynamoDB } from "aws-sdk";
import { getConstructor } from "./get";

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
