/* eslint-env jest */
import { buildParser } from "./parsing";

const PARSER = buildParser(";", "true", "false");

function expectParseSuccess(result) {
  expect(result.status).toBe(true);
}

test("Boolean literal", () => {
  const result = PARSER.Program.parse("true");

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "Bool", value: true });
});

test("Trailing whitespace should be permitted", () => {
  const result = PARSER.Program.parse("true \n \n");

  expectParseSuccess(result);
});

test("Parse a simple list", () => {
  const result = PARSER.Program.parse("(foo true)");
  expectParseSuccess(result);
});

test("Whitespace inside list", () => {
  const result = PARSER.Program.parse("(foo )");
  expectParseSuccess(result);
});

test("Comments with ( should take precedence", () => {
  const parser = buildParser("(", "true", "false");
  const result = parser.Program.parse("(foo true)\n(foo bar)");
  expect(result.value).toStrictEqual([]);
});

test("If expression", () => {
  const result = PARSER.Program.parse("(if true 1 2)");
  expectParseSuccess(result);

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "If" });
});

test("Set expression", () => {
  const result = PARSER.Program.parse("(set x 1)");
  expectParseSuccess(result);

  const firstExpr = result.value[0];
  expect(firstExpr).toMatchObject({ name: "Assign" });
});
