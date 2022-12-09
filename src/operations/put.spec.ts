import { DynamoDB } from "aws-sdk";
import { putConstructor, PutOperation, buildMockPut } from "..";

describe("PutOperation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const put = putConstructor<User>(client, "test");

  test("should put an object", async () => {
    const id = `id${new Date().getTime()}`;

    const result = await put(({ values }) => [
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
});

describe("BuildMockPut", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = PutOperation<User>;

  test("should return the passed id", async () => {
    const put = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    put.mockImplementation(
      buildMockPut(({ values }) => ({
        ...values,
        createdAt: new Date(),
      })),
    );

    const result = await put(({ values }) => [
      values({
        id: "uuid",
        name: "Jinsu",
      }),
    ]);

    expect(result?.id).toBe("uuid");
    expect(result?.name).toBe("Jinsu");
    expect(result?.createdAt).toBeInstanceOf(Date);
  });
});
