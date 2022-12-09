import { keyConstructor, mockKeyReducer } from "./key";

describe("MockKeyReducer", () => {
  type User = {
    id: string;
    createdAt: Date;
  };

  test("should return a key property", () => {
    const keyReducer = keyConstructor<User, "id", never>({ toDateString: (value) => value.toISOString() });

    const result = keyReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      Key: {
        id: "uuid",
      },
    });
  });
});

describe("MockKeyReducer", () => {
  test("should return a key property", () => {
    const result = mockKeyReducer({
      id: "uuid",
    })({});

    expect(result).toStrictEqual({
      key: {
        id: "uuid",
      },
    });
  });
});
