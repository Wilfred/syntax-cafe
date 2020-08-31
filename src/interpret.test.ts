import type { Context } from "./interpret";
import { run } from "./interpret";
import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";

const PARSER = buildParser(DEFAULT_LANG_OPTS, "do");

function parseAndRun(src: string): Context {
  const parseResult = PARSER.Program.parse(src);
  if (parseResult.status) {
    return run(parseResult.value, DEFAULT_LANG_OPTS);
  } else {
    expect(parseResult.status).toBe(true);
    // Jest will have terminated on the previous line, make tsc happy.
    throw Error("Assertion failed");
  }
}

function expectError(ctx: Context): void {
  expect(ctx.error).not.toBeNull();
}

function expectResult(ctx: Context, value: any): void {
  expect(ctx.error).toBeNull();
  expect(ctx.result.value).toBe(value);
}

test("Boolean literal evaluation", () => {
  const ctx = parseAndRun("true");

  expectResult(ctx, true);
});

test("Multiple expressions", () => {
  const ctx = parseAndRun("true false");

  expectResult(ctx, false);
});

test("String literal evaluation", () => {
  const ctx = parseAndRun('"foo"');

  expectResult(ctx, "foo");
});

describe("add", () => {
  it("should evaluate 1 + 2 as 3", () => {
    const ctx = parseAndRun("(add 1 2)");

    expectResult(ctx, 3);
  });
  it("should require numbers", () => {
    const ctx = parseAndRun('(add 1 "foo")');

    expectError(ctx);
  });
});

test("Unbound variable error", () => {
  const ctx = parseAndRun("nosuchvar");

  expectError(ctx);
  expect(ctx.error).toBe("Unbound variable: nosuchvar");
});

test("Unbound function in argument", () => {
  // Error should propagate.
  const ctx = parseAndRun("(add 1 (nosuchfunc))");

  expectError(ctx);
});

describe("if", () => {
  it("should evaluate the first expression on true conditions", () => {
    const ctx = parseAndRun("(if true 2 (foo))");

    expectResult(ctx, 2);
  });
  it("should evaluate the second expression on false conditions", () => {
    const ctx = parseAndRun("(if false (foo) 2)");

    expectResult(ctx, 2);
  });
  it("should error on non boolean inputs", () => {
    const ctx = parseAndRun("(if 123 1 2)");

    expectError(ctx);
  });
});

test("Call nonexistent function", () => {
  const ctx = parseAndRun("(foo)");

  expectError(ctx);
});

test("Assignment", () => {
  const ctx = parseAndRun("(set x 1) x");

  expectResult(ctx, 1);
});

describe("lte", () => {
  it("should evaluate 1 <= 2 as true", () => {
    const ctx = parseAndRun("(lte 1 2)");

    expectResult(ctx, true);
  });

  it("should evaluate 1 <= 1 as true", () => {
    const ctx = parseAndRun("(lte 1 1)");

    expectResult(ctx, true);
  });
  it("should evaluate 2 <= 1 as false", () => {
    const ctx = parseAndRun("(lte 2 1)");

    expectResult(ctx, false);
  });
  it("should require numbers", () => {
    const ctx = parseAndRun('(lte 1 "foo")');

    expectError(ctx);
  });
  it("should require two argments", () => {
    const ctx = parseAndRun("(lte 1 2 3)");

    expectError(ctx);
  });
});

describe("mod", () => {
  it("should evaluate 13 % 5 as 3", () => {
    const ctx = parseAndRun("(mod 13 5)");

    expectResult(ctx, 3);
  });
  it("should require number arguments", () => {
    const ctx = parseAndRun("(mod 1 null)");

    expectError(ctx);
  });
});

describe("equal", () => {
  it('should treat "foo" === "foo" as true', () => {
    const ctx = parseAndRun('(equal "foo" "foo")');

    expectResult(ctx, true);
  });
  it('should treat "foo" === "bar" as false', () => {
    const ctx = parseAndRun('(equal "foo" "bar")');

    expectResult(ctx, false);
  });
  it("should require two arguments", () => {
    const ctx = parseAndRun('(equal "foo" "foo" "foo")');

    expectError(ctx);
  });
});

describe("repr", () => {
  it("should wrap in double quotes", () => {
    const ctx = parseAndRun('(repr "foo")');

    expectResult(ctx, '"foo"');
  });

  it("should escape double quotes", () => {
    const ctx = parseAndRun('(repr "foo\\"bar")');

    expectResult(ctx, '"foo\\"bar"');
  });
});

test("Do", () => {
  const ctx = parseAndRun("(do 1 2)");

  expectResult(ctx, 2);
});

test("while false", () => {
  const ctx = parseAndRun("(while false false)");

  expect(ctx.error).toBe(null);
}, 1000);

test("while non-bool", () => {
  const ctx = parseAndRun("(while 0 false)");

  expect(ctx.error).not.toBe(null);
}, 1000);

test("while condition", () => {
  const ctx = parseAndRun("(set x 0) (while (lte x 3) (set x (add x 1))) x");

  expectResult(ctx, 4);
}, 1000);
