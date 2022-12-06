import { preffix } from "./preffix";

describe("Preffix", () => {
  test("should add a pound", () => {
    const result = preffix("#")("something");

    expect(result).toBe("#something");
  });

  test("should not add more pounds", () => {
    const preffixPound = preffix("#");

    const result = preffixPound(preffixPound("something"));

    expect(result).toBe("#something");
  });
});
