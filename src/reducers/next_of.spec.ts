import { nextOfConstructor, mockNextOfReducer } from "./next_of";

describe("NextOfReducer", () => {
  type User = {
    id: string;
    createdAt: Date;
  };

  test("should return a nextOf property", () => {
    const cursorReducer = nextOfConstructor<User, "id", never>({ toDateString: (value) => value.toISOString() });

    const result = cursorReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      ExclusiveStartKey: {
        id: "uuid",
      },
    });
  });
});

describe("MockNextOfReducer", () => {
  test("should return a nextOf property", () => {
    const result = mockNextOfReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      nextOf: {
        id: "uuid",
      },
    });
  });
});
