import { directionConstructor, mockDirectionReducer } from "./direction";

describe("DirectionReducer", () => {
  test("should parse to true", () => {
    const result = directionConstructor()("FORWARD")({});

    expect(result).toStrictEqual({
      ScanIndexForward: true,
    });
  });

  test("should parse to false", () => {
    const result = directionConstructor()("BACKWARD")({});

    expect(result).toStrictEqual({
      ScanIndexForward: false,
    });
  });
});

describe("MockDirectionReducer", () => {
  test("should parse", () => {
    const result = mockDirectionReducer("FORWARD")({});

    expect(result).toStrictEqual({
      direction: "FORWARD",
    });
  });
});
