import { limitConstructor, mockLimitReducer } from "./limit";

describe("LimitReducer", () => {
  test("should parse", () => {
    const result = limitConstructor()(5)({});

    expect(result).toStrictEqual({
      Limit: 5,
    });
  });
});

describe("MockLimitReducer", () => {
  test("should parse", () => {
    const result = mockLimitReducer(5)({});

    expect(result).toStrictEqual({
      limit: 5,
    });
  });
});
