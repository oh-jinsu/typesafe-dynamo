import { DynamoDB } from "aws-sdk";
import { lessThan, or } from "../mappers/puttable";
import { putConstructor } from "./put";
import { removeConstructor } from "./remove";
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

  const scan = scanConstructor<User, "id", never>(client, "test");

  test("should return objects", async () => {
    const result = await scan(({ filter }) => [
      filter({
        name: or("static-user", "strange-user"),
        createdAt: lessThan(new Date()),
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

  const scan = scanConstructor<User, "id", never>(client, "test", { soft: true, deleteDateColumn: "deletedAt" });

  const put = putConstructor<User>(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test", { soft: true, deleteDateColumn: "deletedAt" });

  test("should remove an object", async () => {
    const id = `id${new Date().getTime()}`;

    const name = `name${new Date().getTime()}`;

    await put(({ values }) => [
      values({
        id,
        name,
        createdAt: new Date(),
      }),
    ]);

    await remove(({ key }) => [
      key({
        id,
        name,
      }),
    ]);

    const result = await scan(({ filter }) => [
      filter({
        name,
      }),
    ]);

    expect(result).toStrictEqual([]);
  });
});
