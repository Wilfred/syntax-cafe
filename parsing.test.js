/* eslint-env jest */
import { buildParser } from "./parsing";

test("Parse a simple list", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(foo true)");
  expect(result.status).toBe(true);
});
