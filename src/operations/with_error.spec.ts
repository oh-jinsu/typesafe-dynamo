import { withError } from "./with_error";

describe("With error", () => {
  test("should throw an error", async () => {
    try {
      await withError(
        async () =>
          ({
            $response: {
              error: true,
            },
          } as any),
      );

      fail();
    } catch (e: any) {
      expect(e).toBe(true);
    }
  });

  test("should not throw an error", async () => {
    try {
      const result = await withError(
        async () =>
          ({
            $response: {},
          } as any),
      );

      expect(result).toBeTruthy();
    } catch (e: any) {
      fail();
    }
  });
});
