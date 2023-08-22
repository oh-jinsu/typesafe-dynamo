import { getDateMappers } from "./date_mappers";
import { usefulObjectMapper, usefulValueMapper } from "./useful";

describe("UsefulValueMapper", () => {
  const { fromDate, validateDate } = getDateMappers();

  test("should return a date", () => {
    const result = usefulValueMapper(fromDate, validateDate)("2023-01-01T00:00:00.000Z");

    expect(result).toStrictEqual(new Date("2023-01-01T00:00:00.000Z"));
  });

  test("should not map a unix timestamp", () => {
    const fromDate = (value: string) => new Date(value);

    const result = usefulValueMapper(fromDate, validateDate)(1672531200000);

    expect(result).toBe(1672531200000);
  });

  test("should parse the nested object", () => {
    const fromDate = (value: string) => new Date(value);

    const result = usefulValueMapper(
      fromDate,
      validateDate,
    )({
      message: "Hello, world!",
    });

    expect(result.message).toBe("Hello, world!");
  });
});

describe("UsefulObjectMapper", () => {
  const { fromDate, validateDate } = getDateMappers();

  test("should return a date", () => {
    const result = usefulObjectMapper(
      fromDate,
      validateDate,
    )({
      created_at: "2023-01-01T00:00:00.000Z",
    });

    expect(result).toStrictEqual({
      createdAt: new Date("2023-01-01T00:00:00.000Z"),
    });
  });

  test("should not map a unix timestamp", () => {
    const result = usefulObjectMapper(
      fromDate,
      validateDate,
    )({
      createdAt: 1672531200000,
    });

    expect(result).toStrictEqual({
      createdAt: 1672531200000,
    });
  });
});
