import { mockSelectReducer, selectConstructor } from "./select";

describe("SelectReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const select = selectConstructor<User>();

    const result = select("id", "name")({});

    expect(result).toStrictEqual({
      ProjectionExpression: "#id, #name",
      ExpressionAttributeNames: {
        "#id": "id",
        "#name": "name",
      },
    });
  });

  test("should parse continuously", () => {
    const select = selectConstructor<User>();

    const result = select("name")(select("id")({}));

    expect(result).toStrictEqual({
      ProjectionExpression: "#id, #name",
      ExpressionAttributeNames: {
        "#id": "id",
        "#name": "name",
      },
    });
  });
});

describe("MockSelectReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const result = mockSelectReducer<User>("id")({});

    expect(result).toStrictEqual({
      select: ["id"],
    });
  });
});
