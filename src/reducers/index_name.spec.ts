import { indexNameConstructor, mockIndexNameReducer } from "./index_name";

describe("IndexNameReducer", () => {
  test("should parse", () => {
    const result = indexNameConstructor()("SortByCreatedAt")({});

    expect(result).toStrictEqual({
      IndexName: "SortByCreatedAt",
    });
  });
});

describe("MockIndexNameReducer", () => {
  test("should parse", () => {
    const result = mockIndexNameReducer("SortByCreatedAt")({});

    expect(result).toStrictEqual({
      indexName: "SortByCreatedAt",
    });
  });
});
