import { GetOperation } from "./get";
import { buildMockGet } from "./get_mock";

describe("BuildMockGet", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = GetOperation<User, "id", never>;

  test("should return the passed id", async () => {
    const get = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    get.mockImplementation(
      buildMockGet(({ key }) => ({
        id: key[0].id,
        name: "name",
        createdAt: new Date(),
      })),
    );

    const result = await get(({ key }) => [
      key({
        id: "0000",
      }),
    ]);

    expect(result?.id).toBe("0000");
  });
});
