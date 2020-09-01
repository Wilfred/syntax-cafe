import type { Context } from "./interpret";
import { run } from "./interpret";
import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";

const PARSER = buildParser(DEFAULT_LANG_OPTS, "do");

function expectEvalTo(src: string, value: any): void {
  const parseResult = PARSER.Program.parse(src);
  if (parseResult.status) {
    const ctx = run(parseResult.value, DEFAULT_LANG_OPTS);
    expect(ctx.error).toBeNull();
    expect(ctx.result.value).toBe(value);
  } else {
    expect(parseResult.status).toBe(true);
    // Jest will have terminated on the previous line, make tsc happy.
    throw Error("Assertion failed");
  }
}

function expectEvalError(src: string): Context {
  const parseResult = PARSER.Program.parse(src);
  if (parseResult.status) {
    const ctx = run(parseResult.value, DEFAULT_LANG_OPTS);
    expect(ctx.error).not.toBeNull();
    return ctx;
  } else {
    expect(parseResult.status).toBe(true);
    // Jest will have terminated on the previous line, make tsc happy.
    throw Error("Assertion failed");
  }
}

function expectResult(ctx: Context, value: any): void {
  expect(ctx.error).toBeNull();
  expect(ctx.result.value).toBe(value);
}

test("Boolean literal evaluation", () => {
  expectEvalTo("true", true);
});

test("Multiple expressions", () => {
  expectEvalTo("true false", false);
});

test("String literal evaluation", () => {
  expectEvalTo('"foo"', "foo");
});

describe("add", () => {
  it("should evaluate 1 + 2 as 3", () => {
    expectEvalTo("(add 1 2)", 3);
  });
  it("should require numbers", () => {
    expectEvalError('(add 1 "foo")');
  });
});

test("Unbound variable error", () => {
  const ctx = expectEvalError("nosuchvar");
  expect(ctx.error).toBe("Unbound variable: nosuchvar");
});

test("Unbound function in argument", () => {
  expectEvalError("(add 1 (nosuchfunc))");
});

describe("if", () => {
  it("should evaluate the first expression on true conditions", () => {
    expectEvalTo("(if true 2 (foo))", 2);
  });
  it("should evaluate the second expression on false conditions", () => {
    expectEvalTo("(if false (foo) 2)", 2);
  });
  it("should error on non boolean inputs", () => {
    expectEvalError("(if 123 1 2)");
  });
});

test("Call nonexistent function", () => {
  expectEvalError("(foo)");
});

test("Assignment", () => {
  expectEvalTo("(set x 1) x", 1);
});

describe("lte", () => {
  it("should evaluate 1 <= 2 as true", () => {
    expectEvalTo("(lte 1 2)", true);
  });

  it("should evaluate 1 <= 1 as true", () => {
    expectEvalTo("(lte 1 1)", true);
  });
  it("should evaluate 2 <= 1 as false", () => {
    expectEvalTo("(lte 2 1)", false);
  });
  it("should require numbers", () => {
    expectEvalError('(lte 1 "foo")');
  });
  it("should require two argments", () => {
    expectEvalError("(lte 1 2 3)");
  });
});

describe("mod", () => {
  it("should evaluate 13 % 5 as 3", () => {
    expectEvalTo("(mod 13 5)", 3);
  });
  it("should require number arguments", () => {
    expectEvalError("(mod 1 null)");
  });
});

describe("equal", () => {
  it('should treat "foo" === "foo" as true', () => {
    expectEvalTo('(equal "foo" "foo")', true);
  });
  it('should treat "foo" === "bar" as false', () => {
    expectEvalTo('(equal "foo" "bar")', false);
  });
  it("should require two arguments", () => {
    expectEvalError('(equal "foo" "foo" "foo")');
  });
});

describe("concat", () => {
  it("concatenates two strings", () => {
    expectEvalTo('(concat "foo" "bar")', "foobar");
  });
  it("concatenates three strings", () => {
    expectEvalTo('(concat "foo" "bar" "baz")', "foobarbaz");
  });
});

describe("repr", () => {
  it("should wrap in double quotes", () => {
    expectEvalTo('(repr "foo")', '"foo"');
  });

  it("should escape double quotes", () => {
    expectEvalTo('(repr "foo\\"bar")', '"foo\\"bar"');
  });

  it("should escape backslashes", () => {
    expectEvalTo('(repr "\\\\")', '"\\\\"');
  });

  it("should escape multiple double quotes", () => {
    expectEvalTo('(repr "foo\\"\\"bar")', '"foo\\"\\"bar"');
  });

  it("should escape newlines", () => {
    expectEvalTo('(repr "\\n")', '"\\n"');
  });

  it("should escape alternative quotes", () => {
    const langOpts = DEFAULT_LANG_OPTS.set("stringDelimiter", "q");
    const parser = buildParser(langOpts, "curly");
    const parseResult = parser.Program.parse("(repr qfoo\\qbarq)");

    if (parseResult.status) {
      const result = run(parseResult.value, langOpts);
      expectResult(result, "qfoo\\qbarq");
    } else {
      expect(parseResult.status).toBe(true);
      // Jest will have terminated on the previous line, make tsc happy.
      throw Error("Assertion failed");
    }
  });
});

test("Do", () => {
  expectEvalTo("(do 1 2)", 2);
});

test("while false", () => {
  expectEvalTo("(while false false)", null);
}, 1000);

test("while non-bool", () => {
  expectEvalError("(while 0 false)");
}, 1000);

test("while condition", () => {
  expectEvalTo("(set x 0) (while (lte x 3) (set x (add x 1))) x", 4);
}, 1000);
