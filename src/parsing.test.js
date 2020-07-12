/* eslint-env jest */
import { buildParser } from "./parsing";

test("Boolean literal", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("true");

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "Bool", value: true });
});

test("Parse a simple list", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(foo true)");
  expect(result.status).toBe(true);
});

test("Comments with ( should take precedence", () => {
  const parser = buildParser("(", "true", "false");
  const result = parser.Program.parse("(foo true)\n(foo bar)");
  expect(result.value).toStrictEqual([]);
});
