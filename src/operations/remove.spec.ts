import { DynamoDB } from "aws-sdk";
import { getConstructor } from "./get";
import { putConstructor } from "./put";
import { buildMockRemove, removeConstructor, RemoveOperation } from "./remove";
import { updateConstructor } from "./update";

describe("Put/Update/Remove operation", () => {
  const client = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
  });

  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  const get = getConstructor<User, "id", "name">(client, "test");

  const put = putConstructor<User>(client, "test");

  const update = updateConstructor<User, "id", "name">(client, "test");

  const remove = removeConstructor<User, "id", "name">(client, "test");

  const id = `id${new Date().getTime()}`;

  test("should remove an object", async () => {
    await put(({ values }) => [
      values({
        id,
        name: "generated-user",
        age: 25,
      }),
    ]);

    await update(({ key, replace }) => [
      key({
        id,
        name: "generated-user",
      }),
      replace({
        age: 23,
      }),
    ]);

    await remove(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    const result = await get(({ key }) => [
      key({
        id,
        name: "generated-user",
      }),
    ]);

    expect(result).toBeUndefined();
  });
});

describe("BuildMockRemove", () => {
  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  type TestOperation = RemoveOperation<User, "id", never>;

  test("should return the passed id", async () => {
    const remove = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    remove.mockImplementation(buildMockRemove(() => undefined));

    const promise = () =>
      remove(({ key }) => [
        key({
          id: "uuid",
        }),
      ]);

    expect(promise).not.toThrow();
  });
});
