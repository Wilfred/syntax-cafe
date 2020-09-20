import P from "parsimmon";

import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";

const PARSER = buildParser(DEFAULT_LANG_OPTS);

function expectParseSuccess(src: string, parser: P.Language): Array<any> {
  const result = parser.Program.parse(src);

  if (!result.status) {
    console.warn(P.formatError(src, result));
    expect(result.status).toBe(true);
    // Jest will have terminated on the previous line, make tsc happy.
    throw Error("Assertion failed");
  }

  return result.value;
}

function expectParseError(src: string, parser: P.Language): void {
  const result = parser.Program.parse(src);
  expect(result.status).toBe(false);
}

test("Boolean literal", () => {
  const exprs = expectParseSuccess("true", PARSER);
  expect(exprs[0]).toMatchObject({ name: "Bool", value: true });
});

describe("String literals", () => {
  it('Should parse "foo"', () => {
    const exprs = expectParseSuccess('"foo"', PARSER);
    expect(exprs[0]).toMatchObject({ name: "String", value: "foo" });
  });
  it("Should parse escaped newlines", () => {
    const exprs = expectParseSuccess('"\\n"', PARSER);

    expect(exprs[0]).toMatchObject({ name: "String", value: "\n" });
  });
  it("Should parse escaped doublequotes", () => {
    const exprs = expectParseSuccess('"\\""', PARSER);

    expect(exprs[0]).toMatchObject({ name: "String", value: '"' });
  });
  it("Should parse escaped backslashes", () => {
    const exprs = expectParseSuccess('"\\\\"', PARSER);

    expect(exprs[0]).toMatchObject({ name: "String", value: "\\" });
  });
  it("Should not parse arbitrary escapes", () => {
    expectParseError('"\\g"', PARSER);
  });
  it("Should parse qfooq if q is the delimiter", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("stringDelimiter", "q"));
    const exprs = expectParseSuccess("qfooq", parser);

    expect(exprs[0]).toMatchObject({ name: "String", value: "foo" });
  });
  it("Should parse |foo| if | is the delimiter", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("stringDelimiter", "|"));
    const exprs = expectParseSuccess("|foo|", parser);

    expect(exprs[0]).toMatchObject({ name: "String", value: "foo" });
  });
  it("Should parse escapes if | is the delimiter", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("stringDelimiter", "|"));
    const exprs = expectParseSuccess("|foo\\|bar|", parser);

    expect(exprs[0]).toMatchObject({ name: "String", value: "foo|bar" });
  });
});

describe("Blocks", () => {
  it("Should parse (do ... ) blocks", () => {
    const exprs = expectParseSuccess("(do (foo) (bar))", PARSER);

    expect(exprs[0]).toMatchObject({ name: "Block" });
  });
  it("Should parse { ... } curly blocks", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess("{ (foo); (bar); }", parser);

    expect(exprs[0]).toMatchObject({ name: "Block" });
  });
});

test("Trailing whitespace should be permitted", () => {
  expectParseSuccess("true \n \n", PARSER);
});

test("Empty list should be a parse error", () => {
  expectParseError("()", PARSER);
});

describe("function calls", () => {
  it("parse a zero argument call", () => {
    const exprs = expectParseSuccess("(foo)", PARSER);
    expect(exprs[0]).toMatchObject({ name: "FunctionCall" });
  });

  it("parse a multiple argument call", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess("(lte i 20);", parser);
    expect(exprs[0]).toMatchObject({ name: "FunctionCall" });
  });

  it("should allow set(); as a normal function", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess("(set 1);", parser);

    expect(exprs[0]).toMatchObject({ name: "FunctionCall" });
  });
});

test("Whitespace inside list", () => {
  expectParseSuccess("(foo )", PARSER);
});

test("Comments with ( should take precedence", () => {
  const parser = buildParser(DEFAULT_LANG_OPTS.set("commentPrefix", "("));
  const exprs = expectParseSuccess("(foo true)\n(foo bar)", parser);

  expect(exprs).toStrictEqual([]);
});

describe("if", () => {
  it("should parse (if ...)", () => {
    const exprs = expectParseSuccess("(if true 1 2)", PARSER);

    expect(exprs[0]).toMatchObject({ name: "If" });
  });
  it("should parse (customkeyword ...)", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("ifKeyword", "custom"));
    const exprs = expectParseSuccess("(custom true 1 2)", parser);

    expect(exprs[0]).toMatchObject({ name: "If" });
  });
  it("should parse if {...} else {...}", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess(
      "if true { (foo); } else { (bar); }",
      parser
    );

    expect(exprs[0]).toMatchObject({ name: "If" });
  });
});

describe("while", () => {
  it("should parse (if ...)", () => {
    const exprs = expectParseSuccess("(while true 2)", PARSER);

    expect(exprs[0]).toMatchObject({ name: "While" });
  });

  it("should parse while true {}", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess("while true {}", parser);

    expect(exprs[0]).toMatchObject({ name: "While" });
  });
});

describe("Assign", () => {
  it("should parse valid assignments", () => {
    const exprs = expectParseSuccess("(set x 1)", PARSER);

    expect(exprs[0]).toMatchObject({ name: "Assign" });
  });
  it("should reject assigning to non-symbols", () => {
    expectParseError("(set 1 1)", PARSER);
  });
  it("should reject assigning to boolean constants", () => {
    expectParseError("(set true 1)", PARSER);
  });

  it("should use infix = with statements", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("statementTerminator", ";")
    );
    const exprs = expectParseSuccess("x = 1;", parser);
    expect(exprs[0]).toMatchObject({ name: "Assign" });
  });
});
