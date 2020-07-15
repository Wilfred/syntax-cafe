/* eslint-env jest */
import { buildParser } from "./parsing";

test("Boolean literal", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("true");

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "Bool", value: true });
});

test("Trailing whitespace should be permitted", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("true \n \n");

  expect(result.status).toBe(true);
});

test("Parse a simple list", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(foo true)");
  expect(result.status).toBe(true);
});

test("Whitespace inside list", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(foo )");
  expect(result.status).toBe(true);
});

test("Comments with ( should take precedence", () => {
  const parser = buildParser("(", "true", "false");
  const result = parser.Program.parse("(foo true)\n(foo bar)");
  expect(result.value).toStrictEqual([]);
});

test("If expression", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(if true 1 2)");

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "If" });
});

test("Set expression", () => {
  const parser = buildParser(";", "true", "false");
  const result = parser.Program.parse("(set x 1)");

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "Assign" });
});
