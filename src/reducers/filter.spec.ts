import { filterConstructor } from "./filter";

describe("FilterReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const filter = filterConstructor<User, "id">({ toDateString });

    const result = filter({
      name: "Jinsu",
      createdAt: new Date("2023-01-01T00:00:00Z"),
    })({});

    expect(result).toStrictEqual({
      FilterExpression: "#name = :name and #createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#name": "name",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":name": "Jinsu",
        ":createdAt": "2023-01-01T00:00:00.000Z",
      },
    });
  });

  test("should parse continuously", () => {
    const toDateString = (value: Date) => value.toISOString();

    const filter = filterConstructor<User, "id">({ toDateString });

    const result = filter({
      createdAt: new Date("2023-01-01T00:00:00Z"),
    })(
      filter({
        name: "Jinsu",
      })({}),
    );

    expect(result).toStrictEqual({
      FilterExpression: "#name = :name and #createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#name": "name",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":name": "Jinsu",
        ":createdAt": "2023-01-01T00:00:00.000Z",
      },
    });
  });
});
