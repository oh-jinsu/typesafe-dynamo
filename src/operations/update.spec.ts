import { DynamoDB } from "aws-sdk";
import { putConstructor } from "./put";
import { updateConstructor } from "./update";

describe("UpdateOperation", () => {
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

  const update = updateConstructor<User, "id", "name">(client, "test");

  const id = `id${new Date().getTime()}`;

  test("should update an object", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
      }),
    ]);

    const result = await update(({ key, replace }) => [
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
});
