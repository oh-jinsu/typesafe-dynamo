import { mockSelectReducer } from "./select_mock";

describe("MockSelectReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const result = mockSelectReducer<User>("id")({});

    expect(result).toStrictEqual({
      select: ["id"],
    });
  });
});
