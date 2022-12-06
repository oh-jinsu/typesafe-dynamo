import { DynamoDB } from "aws-sdk";
import typesafe from ".";

describe("Typsafe", () => {
  test("should be defined", () => {
    const client = new DynamoDB.DocumentClient();

    const operations = typesafe(client, "test");

    expect(operations).toBeDefined();
  });
});
