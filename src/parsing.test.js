/* eslint-env jest */
import { buildParser } from "./parsing";

test("Parse a simple list", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(foo true)");
  expect(result.status).toBe(true);
});

test("Comments with ( should take precedence", () => {
  const parser = buildParser("(", "true", "false");
  const result = parser.Program.parse("(foo true)\n(foo bar)");
  expect(result.value.value).toStrictEqual([]);
});
