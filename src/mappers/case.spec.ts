import { toCamelCase, toSnakeCase } from "./case";

describe("ToSnakeCase", () => {
  test("should convert a camel case", () => {
    const result = toSnakeCase("camelCase");

    expect(result).toBe("camel_case");
  });

  test("should convert a kebab case", () => {
    const result = toSnakeCase("kebab-case");

    expect(result).toBe("kebab_case");
  });

  test("should convert a pascal case", () => {
    const result = toSnakeCase("PascalCase");

    expect(result).toBe("pascal_case");
  });

  test("should not convert a snake case", () => {
    const result = toSnakeCase("snake_case");

    expect(result).toBe("snake_case");
  });
});

describe("ToCamelCase", () => {
  test("should convert a snake case", () => {
    const result = toCamelCase("snake_case");

    expect(result).toBe("snakeCase");
  });

  test("should convert a kebab case", () => {
    const result = toCamelCase("kebab-case");

    expect(result).toBe("kebabCase");
  });

  test("should convert a pascalCase", () => {
    const result = toCamelCase("PascalCase");

    expect(result).toBe("pascalCase");
  });

  test("should not convert a camelCase", () => {
    const result = toCamelCase("camelCase");

    expect(result).toBe("camelCase");
  });
});
