import P from "parsimmon";

import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";

const PARSER = buildParser(DEFAULT_LANG_OPTS);

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
  it("Should parse escaped doublequotes", () => {
    const result = PARSER.Program.parse('"\\""');

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: '"' });
    }
  });
  it("Should parse escaped backslashes", () => {
    const result = PARSER.Program.parse('"\\\\"');

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "\\" });
    }
  });
  it("Should not parse arbitrary escapes", () => {
    const result = PARSER.Program.parse('"\\g"');

    expectParseError(result);
  });
  it("Should parse qfooq if q is the delimiter", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("stringDelimiter", "q"),
    );
    const result = parser.Program.parse("qfooq");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "foo" });
    }
  });
  it("Should parse |foo| if | is the delimiter", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("stringDelimiter", "|"),
    );
    const result = parser.Program.parse("|foo|");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "foo" });
    }
  });
  it("Should parse escapes if | is the delimiter", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("stringDelimiter", "|"),
    );
    const result = parser.Program.parse("|foo\\|bar|");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "String", value: "foo|bar" });
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
    const parser = buildParser(DEFAULT_LANG_OPTS.set("statementTerminator", ";"));
    const src = "{ (foo) (bar) }"
    const result = parser.Program.parse(src);

    if (!result.status) {
      console.warn(P.formatError(src, result));
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
  const parser = buildParser(
    DEFAULT_LANG_OPTS.set("commentPrefix", "("),
  );
  const result = parser.Program.parse("(foo true)\n(foo bar)");

  expectParseSuccess(result);
  if (result.status) {
    expect(result.value).toStrictEqual([]);
  }
});

describe("if", () => {
  it("should parse (if ...)", () => {
    const result = PARSER.Program.parse("(if true 1 2)");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "If" });
    }
  });
  it("should parse (customkeyword ...)", () => {
    const parser = buildParser(
      DEFAULT_LANG_OPTS.set("ifKeyword", "custom"),
    );
    const result = parser.Program.parse("(custom true 1 2)");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "If" });
    }
  });
  it("should parse if {...} else {...}", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("statementTerminator", ";"));
    const src = "if true { (foo) } else { (bar) }";
    const result = parser.Program.parse(src);

    if (!result.status) {
      console.warn(P.formatError(src, result));
    }
    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "If" });
    }
  });
});

describe("while", () => {
  it("should parse (if ...)", () => {
    const result = PARSER.Program.parse("(while true 2)");

    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "While" });
    }
  });

  it("should parse while true {}", () => {
    const parser = buildParser(DEFAULT_LANG_OPTS.set("statementTerminator", ";"));
    const src = "while true {}";
    const result = parser.Program.parse(src);

    if (!result.status) {
      console.warn(P.formatError(src, result));
    }
    expectParseSuccess(result);
    if (result.status) {
      const firstExpr = result.value[0];
      expect(firstExpr).toMatchObject({ name: "While" });
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
