import { DynamoDB } from "aws-sdk";
import { scanConstructor } from "./scan";

describe("Scan operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  const scan = scanConstructor<User, "id">(client, "test");

  test("should return objects", async () => {
    const result = await scan(({ filter }) => [
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
