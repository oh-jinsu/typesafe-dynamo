import { DynamoDB } from "aws-sdk";
import { queryConstructor } from "./query";

describe("Query operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const query = queryConstructor<User, "id", "name">(client, "test");

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
});
