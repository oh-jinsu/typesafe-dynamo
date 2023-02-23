import { mockNextOfReducer } from "./next_of_mock";

describe("MockNextOfReducer", () => {
  test("should return a nextOf property", () => {
    const result = mockNextOfReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      nextOf: [
        {
          id: "uuid",
        },
      ],
    });
  });
});
