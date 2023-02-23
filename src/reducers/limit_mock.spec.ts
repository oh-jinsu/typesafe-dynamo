import { mockLimitReducer } from "./limit_mock";

describe("MockLimitReducer", () => {
  test("should parse", () => {
    const result = mockLimitReducer(5)({});

    expect(result).toStrictEqual({
      limit: [5],
    });
  });
});
