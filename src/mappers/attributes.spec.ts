import { attributeNamesMapper, attributeValuesMapper } from "./attributes";

describe("AttributeNamesMapper", () => {
  test("should parse", () => {
    const map = attributeNamesMapper();

    const result = map({
      lastName: "Oh",
      firstName: "Jinsu",
    });

    expect(result).toStrictEqual({
      "#lastName": "lastName",
      "#firstName": "firstName",
    });
  });
});

describe("AttributeValuesMapper", () => {
  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const map = attributeValuesMapper(toDateString);

    const result = map({
      lastName: "Oh",
      firstName: "Jinsu",
    });

    expect(result).toStrictEqual({
      ":lastName": "Oh",
      ":firstName": "Jinsu",
    });
  });
});
