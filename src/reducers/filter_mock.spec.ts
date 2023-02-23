import { mockFilterReducer } from "./filter_mock";

describe("MockFilterReducer", () => {
  test("should parse", () => {
    const result = mockFilterReducer({
      name: "name",
    })({});

    expect(result).toStrictEqual({
      filter: [
        {
          name: "name",
        },
      ],
    });
  });
});
