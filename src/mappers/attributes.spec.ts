import { attributeNamesReducer, attributeValuesReducer } from "./attributes";

describe("AttributeNamesMapper", () => {
  test("should parse", () => {
    const reducer = attributeNamesReducer();

    const result = Object.entries({
      lastName: "Oh",
      firstName: "Jinsu",
    }).reduce(reducer, {});

    expect(result).toStrictEqual({
      "#lastName": "lastName",
      "#firstName": "firstName",
    });
  });
});

describe("AttributeValuesMapper", () => {
  test("should parse", () => {
    const toDateString = (value: Date) => value.toISOString();

    const reducer = attributeValuesReducer(toDateString);

    const result = Object.entries({
      lastName: "Oh",
      firstName: "Jinsu",
    }).reduce(reducer, {});

    expect(result).toStrictEqual({
      ":lastName": "Oh",
      ":firstName": "Jinsu",
    });
  });
});
