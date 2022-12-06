import { conditionConstructor } from "./condition";

describe("ConditionReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const condition = conditionConstructor<User, "id", "name">({ toDateString });

    const result = condition({
      id: "uuid",
      name: "Jinsu",
    })({});

    expect(result).toStrictEqual({
      KeyConditionExpression: "#id = :id and #name = :name",
      ExpressionAttributeNames: {
        "#id": "id",
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":id": "uuid",
        ":name": "Jinsu",
      },
    });
  });

  test("should parse continuously", () => {
    const toDateString = (value: Date) => value.toISOString();

    const condition = conditionConstructor<User, "id", "name">({ toDateString });

    const result = condition({
      name: "Jinsu",
    })(
      condition({
        id: "uuid",
      })({}),
    );

    expect(result).toStrictEqual({
      KeyConditionExpression: "#id = :id and #name = :name",
      ExpressionAttributeNames: {
        "#id": "id",
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":id": "uuid",
        ":name": "Jinsu",
      },
    });
  });
});
