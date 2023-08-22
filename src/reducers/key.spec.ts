import { keyConstructor } from "./key";

describe("KeyReducer", () => {
  type User = {
    id: string;
    createdAt: Date;
  };

  test("should return a key property", () => {
    const keyReducer = keyConstructor<User, "id", never>({ toDate: (value) => value.toISOString() });

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
