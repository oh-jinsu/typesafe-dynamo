import { mapper } from "./map";

describe("Map", () => {
  test("should convert object with key in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    const result = map({
      lastName: "Oh",
      firstName: "Jinsu",
    });

    expect(result).toStrictEqual({
      LASTNAME: "OH",
      FIRSTNAME: "JINSU",
    });
  });

  test("should convert null in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    const result = map(null);

    expect(result).toBeUndefined();
  });

  test("should convert value with key in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    const result = map("OhJinsu");

    expect(result).toBe("OHJINSU");
  });

  test("should convert null array with key in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    const result = map([null, null, null]);

    expect(result).toStrictEqual([undefined, undefined, undefined]);
  });

  test("should convert number array with key in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    expect(() => map([1, 2, 3])).toThrow("value.toUpperCase is not a function");
  });

  test("should convert object array with key in uppercase", () => {
    const map = mapper<string, string>(([key, value]) => [key.toUpperCase(), value.toUpperCase()]);

    const result = map([
      {
        lastName: "Oh",
        firstName: "Jinsu",
      },
      {
        lastName: "Kim",
        firstName: "Soohyeok",
      },
    ]);

    expect(result).toStrictEqual([
      {
        LASTNAME: "OH",
        FIRSTNAME: "JINSU",
      },
      {
        LASTNAME: "KIM",
        FIRSTNAME: "SOOHYEOK",
      },
    ]);
  });
});
