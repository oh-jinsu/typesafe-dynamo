import { mockConditionReducer } from "./condition_mock";

describe("MockCondition", () => {
  test("should parse", () => {
    const result = mockConditionReducer({
      id: "1",
    })({});

    expect(result).toStrictEqual({
      condition: [
        {
          id: "1",
        },
      ],
    });
  });

  test("should parse with index", () => {
    const result = mockConditionReducer("index", {
      id: "1",
    })({});

    expect(result).toStrictEqual({
      condition: [
        "index",
        {
          id: "1",
        },
      ],
    });
  });

  test("should parse with continously", () => {
    const result = mockConditionReducer({
      id: "2",
    })(
      mockConditionReducer("index", {
        id: "1",
      })({}),
    );

    expect(result).toStrictEqual({
      condition: [
        {
          id: "2",
        },
      ],
    });
  });

  test("should parse with index continously", () => {
    const result = mockConditionReducer("second", {
      id: "2",
    })(
      mockConditionReducer("index", {
        id: "1",
      })({}),
    );

    expect(result).toStrictEqual({
      condition: [
        "second",
        {
          id: "2",
        },
      ],
    });
  });
});
