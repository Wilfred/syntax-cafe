import P from "parsimmon";

import { buildParser } from "./parsing";

const PARSER = buildParser({
  commentPrefix: ";",
  trueLiteral: "true",
  falseLiteral: "false",
  whileKeyword: "while",
});

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

describe("Blocks", () => {
  it("Should parse (do ... ) blocks", () => {
    const result = PARSER.Program.parse("(do (foo) (bar))");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "Block" });
    }
  });
  it("Should parse { ... } curly blocks", () => {
    const parser = buildParser({
      commentPrefix: ";",
      trueLiteral: "true",
      falseLiteral: "false",
      whileKeyword: "while",
      blockStyle: "curly",
    });
    const result = parser.Program.parse("{ (foo) (bar) }");

    if (!result.status) {
      console.warn(P.formatError("{ (foo) (bar) } } ", result));
    }

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "Block" });
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
  const parser = buildParser({
    commentPrefix: "(",
    trueLiteral: "true",
    falseLiteral: "false",
    whileKeyword: "while",
  });
  const result = parser.Program.parse("(foo true)\n(foo bar)");

  expectParseSuccess(result);
  if (result.status) {
    expect(result.value).toStrictEqual([]);
  }
});

describe("If expression", () => {
  it("should parse (if ...)", () => {
    const result = PARSER.Program.parse("(if true 1 2)");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "If" });
    }
  });
  it("should parse if {...} else {...}", () => {
    const parser = buildParser({
      commentPrefix: ";",
      trueLiteral: "true",
      falseLiteral: "false",
      whileKeyword: "while",
      blockStyle: "curly",
    });
    const result = parser.Program.parse("if true { (foo) } else { (bar) }");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "If" });
    }
  });
});

describe("Assign", () => {
  it("should parse valid assignments", () => {
    const result = PARSER.Program.parse("(set x 1)");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "Assign" });
    }
  });
  it("should reject assigning to non-symbols", () => {
    const result = PARSER.Program.parse("(set 1 1)");
    expectParseError(result);
  });
  it("should reject assigning to boolean constants", () => {
    const result = PARSER.Program.parse("(set true 1)");
    expectParseError(result);
  });
});
