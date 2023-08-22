import { acceptableObjectMapper, acceptableValueMapper } from "./acceptable";

describe("AcceptableValueMapper", () => {
  test("should return a null", () => {
    const map = acceptableValueMapper((value) => value.toISOString());

    const result = map(undefined);

    expect(result).toBe(null);
  });

  test("should return an ISO 8601 string", () => {
    const map = acceptableValueMapper((value) => value.toISOString());

    const result = map(new Date("2023-01-01T00:00:00Z"));

    expect(result).toBe("2023-01-01T00:00:00.000Z");
  });

  test("should not return an ISO 8601 string", () => {
    const map = acceptableValueMapper((value) => value.toISOString());

    const result = map(1);

    expect(result).toBe(1);
  });

  test("should stringify the nested object", () => {
    const map = acceptableValueMapper((value) => value.toISOString());

    const result = map({
      lastName: "Oh",
    });

    expect(result).toStrictEqual({
      lastName: "Oh",
    });
  });
});

describe("AcceptableObjectMapper", () => {
  test("should even return a value", () => {
    const map = acceptableObjectMapper((value) => value.toISOString());

    const result = map(new Date("2023-01-01T00:00:00Z"));

    expect(result).toBe("2023-01-01T00:00:00.000Z");
  });

  test("should return an object", () => {
    const map = acceptableObjectMapper((value) => value.toISOString());

    const result = map({
      createdAt: new Date("2023-01-01T00:00:00Z"),
    });

    expect(result).toStrictEqual({
      createdAt: "2023-01-01T00:00:00.000Z",
    });
  });

  test("should return an array", () => {
    const map = acceptableObjectMapper((value) => value.toISOString());

    const result = map([
      {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
      {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
    ]);

    expect(result).toStrictEqual([
      {
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    ]);
  });
});
