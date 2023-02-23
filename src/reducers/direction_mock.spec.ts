import { mockDirectionReducer } from "./direction_mock";

describe("MockDirectionReducer", () => {
  test("should parse", () => {
    const result = mockDirectionReducer("FORWARD")({});

    expect(result).toStrictEqual({
      direction: ["FORWARD"],
    });
  });
});
