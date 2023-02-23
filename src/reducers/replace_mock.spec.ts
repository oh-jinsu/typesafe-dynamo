import { mockReplaceReducer } from "./replace_mock";

describe("ReplaceReducer", () => {
  test("should parse", () => {
    const result = mockReplaceReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      replace: [
        {
          id: "uuid",
        },
      ],
    });
  });
});
