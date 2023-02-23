import { mockKeyReducer } from "./key_mock";

describe("MockKeyReducer", () => {
  test("should return a key property", () => {
    const result = mockKeyReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      key: [
        {
          id: "uuid",
        },
      ],
    });
  });
});
