import { valuesConstructor } from "./values";

describe("ValueReducer", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  test("should parse", () => {
    const toDate = (value: Date) => value.toISOString();

    const values = valuesConstructor<User>({
      toDate,
    });

    const result = values({
      id: "id",
      name: "name",
      createdAt: new Date(),
    })({});

    expect(result.Item.id).toBe("id");

    expect(result.Item.name).toBe("name");

    expect(result.Item.createdAt).toBeDefined();
  });
});
