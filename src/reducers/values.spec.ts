import { valuesConstructor } from "./values";

describe("ValueReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const values = valuesConstructor<User>({
      toDateString,
    });

    const result = values({
      id: "id",
      name: "name",
    })({});

    expect(result.Item.id).toBe("id");

    expect(result.Item.name).toBe("name");

    expect(result.Item.updatedAt).toBeDefined();

    expect(result.Item.createdAt).toBeDefined();
  });
});
