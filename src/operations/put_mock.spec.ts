import { PutOperation } from "./put";
import { buildMockPut } from "./put_mock";

describe("BuildMockPut", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = PutOperation<User>;

  test("should return the passed id", async () => {
    const put = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    put.mockImplementation(buildMockPut(({ values }) => values[0]));

    const result = await put(({ values }) => [
      values({
        id: "uuid",
        name: "Jinsu",
        createdAt: new Date(),
      }),
    ]);

    expect(result?.id).toBe("uuid");
    expect(result?.name).toBe("Jinsu");
    expect(result?.createdAt).toBeInstanceOf(Date);
  });
});
