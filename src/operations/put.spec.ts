import { DynamoDB } from "aws-sdk";
import { putConstructor } from "..";

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
        createdAt: new Date(),
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.age).toBe(25);

    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
