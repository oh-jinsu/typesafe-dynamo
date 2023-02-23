import { QueryOperation } from "./query";
import { buildMockQuery } from "./query_mock";

describe("BuildMockQuery", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = QueryOperation<User, "id", "name">;

  test("should return the passed id", async () => {
    const query = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    query.mockImplementation(
      buildMockQuery(({ condition }) => [
        {
          id: (condition[0] as any).id ?? "",
          name: (condition[0] as any).name ?? "",
          createdAt: new Date(),
        },
      ]),
    );

    const result = await query(({ condition }) => [
      condition({
        id: "uuid",
        name: "Jinsu",
      }),
    ]);

    expect(result[0].id).toBe("uuid");
    expect(result[0].name).toBe("Jinsu");
    expect(result[0].createdAt).toBeInstanceOf(Date);
  });
});
