import { limitConstructor } from "./limit";

describe("LimitReducer", () => {
  test("should parse", () => {
    const result = limitConstructor()(5)({});

    expect(result).toStrictEqual({
      Limit: 5,
    });
  });
});
