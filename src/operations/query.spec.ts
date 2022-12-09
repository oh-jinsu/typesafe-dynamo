import { DynamoDB } from "aws-sdk";
import { buildMockQuery, queryConstructor, QueryOperation } from "./query";

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

describe("BuildMockQuery", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = QueryOperation<User, "id", "name">;

  test("should return the passed id", async () => {
    const query = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    query.mockImplementation(
      buildMockQuery(({ condition }) => [
        {
          id: condition.id ?? "",
          name: condition.name ?? "",
          createdAt: new Date(),
        },
      ]),
    );

    const result = await query(({ condition }) => [
      condition({
        id: "uuid",
        name: "Jinsu",
      }),
    ]);

    expect(result?.[0].id).toBe("uuid");
    expect(result?.[0].name).toBe("Jinsu");
    expect(result?.[0].createdAt).toBeInstanceOf(Date);
  });
});
