import { DynamoDB } from "aws-sdk";
import { buildMockScan, scanConstructor, ScanOperation } from "./scan";

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

describe("BuildMockScan", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = ScanOperation<User, "id">;

  test("should return the passed id", async () => {
    const scan = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    scan.mockImplementation(
      buildMockScan(({ filter }) => [
        {
          id: "uuid",
          name: filter.name ?? "",
          createdAt: new Date(),
        },
      ]),
    );

    const result = await scan(({ filter }) => [
      filter({
        name: "Jinsu",
      }),
    ]);

    expect(result?.[0].id).toBe("uuid");
    expect(result?.[0].name).toBe("Jinsu");
    expect(result?.[0].createdAt).toBeInstanceOf(Date);
  });
});
