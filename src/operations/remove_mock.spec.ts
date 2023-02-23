import { RemoveOperation } from "./remove";
import { buildMockRemove } from "./remove_mock";

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
