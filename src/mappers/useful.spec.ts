import { usefulObjectMapper, usefulValueMapper } from "./useful";

describe("UsefulValueMapper", () => {
  test("should return a date", () => {
    const fromDateString = (value: string) => new Date(value);

    const result = usefulValueMapper(fromDateString)("2023-01-01T00:00:00.000Z");

    expect(result).toStrictEqual(new Date("2023-01-01T00:00:00.000Z"));
  });

  test("should not map a unix timestamp", () => {
    const fromDateString = (value: string) => new Date(value);

    const result = usefulValueMapper(fromDateString)(1672531200000);

    expect(result).toBe(1672531200000);
  });

  test("should parse the nested object", () => {
    const fromDateString = (value: string) => new Date(value);

    const result = usefulValueMapper(fromDateString)(
      `Object ${JSON.stringify({
        message: "Hello, world!",
      })}`,
    );

    expect(result.message).toBe("Hello, world!");
  });
});

describe("UsefulObjectMapper", () => {
  test("should return a date", () => {
    const fromDateString = (value: string) => new Date(value);

    const result = usefulObjectMapper(fromDateString)({
      created_at: "2023-01-01T00:00:00.000Z",
    });

    expect(result).toStrictEqual({
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
    });
  });

  test("should not map a unix timestamp", () => {
    const fromDateString = (value: string) => new Date(value);

    const result = usefulObjectMapper(fromDateString)({
      createdAt: 1672531200000,
    });

    expect(result).toStrictEqual({
      createdAt: 1672531200000,
    });
  });
});
