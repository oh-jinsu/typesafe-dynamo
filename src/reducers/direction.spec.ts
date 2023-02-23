import { directionConstructor } from "./direction";

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
