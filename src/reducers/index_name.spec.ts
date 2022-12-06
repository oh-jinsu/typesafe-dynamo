import { indexNameConstructor } from "./index_name";

describe("IndexNameReducer", () => {
  test("should parse", () => {
    const result = indexNameConstructor()("SortByCreatedAt")({});

    expect(result).toStrictEqual({
      IndexName: "SortByCreatedAt",
    });
  });
});
