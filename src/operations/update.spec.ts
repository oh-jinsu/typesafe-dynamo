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
    birth?: {
      at: Date;
    };
    roles: string[];
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
        roles: ["user"],
        birth: {
          at: new Date(),
        },
        createdAt: new Date(),
      }),
    ]);

    const result = await update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        roles: ["admin"],
        birth: {
          at: new Date(),
        },
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.roles).toStrictEqual(["admin"]);

    expect(result.birth?.at).toBeInstanceOf(Date);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test("should update an object with null", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        roles: ["user"],
        birth: {
          at: new Date(),
        },
        createdAt: new Date(),
      }),
    ]);

    const result = await update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        roles: ["admin"],
        birth: undefined,
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.roles).toStrictEqual(["admin"]);

    expect(result.birth).toBeNull();

    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
