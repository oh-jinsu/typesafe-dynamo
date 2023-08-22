import { replaceConstructor } from "./replace";

describe("ReplaceReducer", () => {
  type User = {
    id: string;
    name: string;
    age: number;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDate = (value: Date) => value.toISOString();

    const replace = replaceConstructor<User, "id", never>({ toDate });

    const result = replace({
      name: "Jinsu",
      age: 25,
    })({});

    expect(result.UpdateExpression).toBe("set #name = :name, #age = :age");

    expect(result.ExpressionAttributeNames?.["#name"]).toBe("name");

    expect(result.ExpressionAttributeNames?.["#age"]).toBe("age");

    expect(result.ExpressionAttributeValues?.[":name"]).toBe("Jinsu");

    expect(result.ExpressionAttributeValues?.[":age"]).toBe(25);
  });

  test("should parse continuously", () => {
    const toDate = (value: Date) => value.toISOString();

    const replace = replaceConstructor<User, "id", never>({ toDate });

    const result = replace({
      age: 25,
    })(
      replace({
        name: "jinsu",
      })({}),
    );

    expect(result.UpdateExpression).toBe("set #name = :name, #age = :age");

    expect(result.ExpressionAttributeNames?.["#name"]).toBe("name");

    expect(result.ExpressionAttributeNames?.["#age"]).toBe("age");

    expect(result.ExpressionAttributeValues?.[":name"]).toBe("jinsu");

    expect(result.ExpressionAttributeValues?.[":age"]).toBe(25);
  });
});
