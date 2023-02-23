import { UpdateOperation } from "./update";
import { buildMockUpdate } from "./update_mock";

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
        id: key[0].id,
        name: replace[0].name ?? "",
        age: replace[0].age ?? 0,
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
