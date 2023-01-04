import { DynamoDB } from "aws-sdk";
import { putConstructor } from "./put";
import { buildMockUpdate, updateConstructor, UpdateOperation } from "./update";

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
        birth: {
          at: new Date(),
        },
      }),
    ]);

    const result = await update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        birth: {
          at: new Date(),
        },
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.birth?.at).toBeInstanceOf(Date);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  test("should update an object with null", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        birth: {
          at: new Date(),
        },
      }),
    ]);

    const result = await update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        birth: undefined,
      }),
    ]);

    expect(result.id).toBe(id);

    expect(result.name).toBe("generated-user");

    expect(result.birth).toBeNull();

    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe("BuildMockUpdate", () => {
  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  type TestOperation = UpdateOperation<User, "id", never>;

  test("should return the passed id", async () => {
    const update = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    update.mockImplementation(
      buildMockUpdate(({ key, replace }) => ({
        id: key.id,
        name: replace.name ?? "",
        age: replace.age ?? 0,
        createdAt: new Date(),
      })),
    );

    const result = await update(({ key, replace }) => [
      key({
        id: "uuid",
      }),
      replace({
        name: "Jinsu",
        age: 25,
      }),
    ]);

    expect(result?.id).toBe("uuid");
    expect(result?.name).toBe("Jinsu");
    expect(result?.age).toBe(25);
    expect(result?.createdAt).toBeInstanceOf(Date);
  });
});
