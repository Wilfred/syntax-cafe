import P from "parsimmon";
import { buildParser } from "./parsing";

const PARSER = buildParser(";", "true", "false");

function expectParseSuccess(result: P.Result<any>): void {
  expect(result.status).toBe(true);
}

function expectParseError(result: P.Result<any>): void {
  expect(result.status).toBe(false);
}

test("Boolean literal", () => {
  const result = PARSER.Program.parse("true");

  expectParseSuccess(result);
  if (result.status) {
    const firstExpr = result.value[0];
    expect(firstExpr).toMatchObject({ name: "Bool", value: true });
  }
});

describe("String literals", () => {
  it('Should parse "foo"', () => {
    const result = PARSER.Program.parse('"foo"');

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "foo" });
    }
  });
  it("Should parse escaped newlines", () => {
    const result = PARSER.Program.parse('"\\n"');

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "\n" });
    }
  });
});

test("Trailing whitespace should be permitted", () => {
  const result = PARSER.Program.parse("true \n \n");

  expectParseSuccess(result);
});

test("Empty list should be a parse error", () => {
  const result = PARSER.Program.parse("()");
  expectParseError(result);
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

  expectParseSuccess(result);
  if (result.status) {
    expect(result.value).toStrictEqual([]);
  }
});

test("If expression", () => {
  const result = PARSER.Program.parse("(if true 1 2)");

  expectParseSuccess(result);
  if (result.status) {
    const firstExpr = result.value[0];
    expect(firstExpr).toMatchObject({ name: "If" });
  }
});

test("Set expression", () => {
  const result = PARSER.Program.parse("(set x 1)");

  expectParseSuccess(result);
  if (result.status) {
    const firstExpr = result.value[0];
    expect(firstExpr).toMatchObject({ name: "Assign" });
  }
});
