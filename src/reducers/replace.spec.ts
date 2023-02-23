import { replaceConstructor } from "./replace";

describe("ReplaceReducer", () => {
  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const replace = replaceConstructor<User, "id", never>({ toDateString });

    const result = replace({
      name: "Jinsu",
      age: 25,
    })({});

    expect(result.UpdateExpression).toBe("set #updatedAt = :updatedAt, #name = :name, #age = :age");

    expect(result.ExpressionAttributeNames?.["#name"]).toBe("name");

    expect(result.ExpressionAttributeNames?.["#age"]).toBe("age");

    expect(result.ExpressionAttributeNames?.["#updatedAt"]).toBe("updatedAt");

    expect(result.ExpressionAttributeValues?.[":name"]).toBe("Jinsu");

    expect(result.ExpressionAttributeValues?.[":age"]).toBe(25);

    expect(result.ExpressionAttributeValues?.[":updatedAt"]).toBeDefined();
  });

  test("should parse continuously", () => {
    const toDateString = (value: Date) => value.toISOString();

    const replace = replaceConstructor<User, "id", never>({ toDateString });

    const result = replace({
      age: 25,
    })(
      replace({
        name: "Jinsu",
      })({}),
    );

    expect(result.UpdateExpression).toBe("set #updatedAt = :updatedAt, #name = :name, #age = :age");

    expect(result.ExpressionAttributeNames?.["#name"]).toBe("name");

    expect(result.ExpressionAttributeNames?.["#age"]).toBe("age");

    expect(result.ExpressionAttributeNames?.["#updatedAt"]).toBe("updatedAt");

    expect(result.ExpressionAttributeValues?.[":name"]).toBe("Jinsu");

    expect(result.ExpressionAttributeValues?.[":age"]).toBe(25);

    expect(result.ExpressionAttributeValues?.[":updatedAt"]).toBeDefined();
  });
});
