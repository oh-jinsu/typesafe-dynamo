import { mockValuesReducer } from "./values_mock";

describe("ValueReducer", () => {
  test("should parse", () => {
    const result = mockValuesReducer({
      name: "Oh",
    })({});

    expect(result).toStrictEqual({
      values: [
        {
          name: "Oh",
        },
      ],
    });
  });
});
