import { ScanOperation } from "./scan";
import { buildMockScan } from "./scan_mock";

describe("BuildMockScan", () => {
  type User = {
    id: string;
    name: string;
    createdAt: Date;
  };

  type TestOperation = ScanOperation<User, "id", never>;

  test("should return the passed id", async () => {
    const scan = jest.fn<ReturnType<TestOperation>, Parameters<TestOperation>>();

    scan.mockImplementation(
      buildMockScan(({ filter }) => [
        {
          id: "uuid",
          name: filter[0].name ?? "",
          createdAt: new Date(),
        },
      ]),
    );

    const result = await scan(({ filter }) => [
      filter({
        name: "Jinsu",
      }),
    ]);

    expect(result[0].id).toBe("uuid");
    expect(result[0].name).toBe("Jinsu");
    expect(result[0].createdAt).toBeInstanceOf(Date);
  });
});
