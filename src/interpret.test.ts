/* eslint-env jest */
import { run } from "./interpret";
import { buildParser } from "./parsing";

const PARSER = buildParser(";", "true", "false");

function expectError(ctx) {
  expect(ctx.error).not.toBeNull();
}

function expectResult(ctx, value) {
  expect(ctx.error).toBeNull();
  expect(ctx.result.value).toBe(value);
}

test("Boolean literal evaluation", () => {
  const result = PARSER.Program.parse("true");
  const ctx = run(result.value);

  expectResult(ctx, true);
});

test("Multiple expressions", () => {
  const result = PARSER.Program.parse("true false");
  const ctx = run(result.value);

  expectResult(ctx, false);
});

test("String literal evaluation", () => {
  const result = PARSER.Program.parse('"foo"');
  const ctx = run(result.value);

  expectResult(ctx, "foo");
});

describe("add", () => {
  it("should evaluate 1 + 2 as 3", () => {
    const result = PARSER.Program.parse("(add 1 2)");
    const ctx = run(result.value);

    expectResult(ctx, 3);
  });
  it("should require numbers", () => {
    const result = PARSER.Program.parse('(add 1 "foo")');
    const ctx = run(result.value);

    expectError(ctx);
  });
});

test("Unbound variable error", () => {
  const result = PARSER.Program.parse("nosuchvar");
  const ctx = run(result.value);

  expectError(ctx);
  expect(ctx.error).toBe("Unbound variable: nosuchvar");
});

test("Unbound function in argument", () => {
  // Error should propagate.
  const result = PARSER.Program.parse("(add 1 (nosuchfunc))");
  const ctx = run(result.value);

  expectError(ctx);
});

test("If expression: true", () => {
  const result = PARSER.Program.parse("(if true 2 (foo))");
  const ctx = run(result.value);

  expectResult(ctx, 2);
});

test("If expression: false", () => {
  const result = PARSER.Program.parse("(if false (foo) 2)");
  const ctx = run(result.value);

  expectResult(ctx, 2);
});

test("Call nonexistent function", () => {
  const result = PARSER.Program.parse("(foo)");
  const ctx = run(result.value);

  expectError(ctx);
});

test("Assignment", () => {
  const result = PARSER.Program.parse("(set x 1) x");
  const ctx = run(result.value);

  expectResult(ctx, 1);
});

describe("lte", () => {
  it("should evaluate 1 <= 2 as true", () => {
    const result = PARSER.Program.parse("(lte 1 2)");
    const ctx = run(result.value);

    expectResult(ctx, true);
  });

  it("should evaluate 1 <= 1 as true", () => {
    const result = PARSER.Program.parse("(lte 1 1)");
    const ctx = run(result.value);

    expectResult(ctx, true);
  });
  it("should evaluate 2 <= 1 as false", () => {
    const result = PARSER.Program.parse("(lte 2 1)");
    const ctx = run(result.value);

    expectResult(ctx, false);
  });
  it("should require numbers", () => {
    const result = PARSER.Program.parse('(lte 1 "foo")');
    const ctx = run(result.value);

    expectError(ctx);
  });
  it("should require two argments", () => {
    const result = PARSER.Program.parse("(lte 1 2 3)");
    const ctx = run(result.value);

    expectError(ctx);
  });
});

describe("mod", () => {
  it("should evaluate 13 % 5 as 3", () => {
    const result = PARSER.Program.parse("(mod 13 5)");
    const ctx = run(result.value);

    expectResult(ctx, 3);
  });
  it("should require number arguments", () => {
    const result = PARSER.Program.parse("(mod 1 null)");
    const ctx = run(result.value);

    expectError(ctx);
  });
});

describe("equal", () => {
  it('should treat "foo" === "foo" as true', () => {
    const result = PARSER.Program.parse('(equal "foo" "foo")');
    const ctx = run(result.value);

    expectResult(ctx, true);
  });
  it('should treat "foo" === "bar" as false', () => {
    const result = PARSER.Program.parse('(equal "foo" "bar")');
    const ctx = run(result.value);

    expectResult(ctx, false);
  });
  it("should require two arguments", () => {
    const result = PARSER.Program.parse('(equal "foo" "foo" "foo")');
    const ctx = run(result.value);

    expectError(ctx);
  });
});

test("Do", () => {
  const result = PARSER.Program.parse("(do 1 2)");
  const ctx = run(result.value);

  expectResult(ctx, 2);
});

test("while false", () => {
  const result = PARSER.Program.parse("(while false false)");
  const ctx = run(result.value);

  expect(ctx.error).toBe(null);
});

test("while non-bool", () => {
  const result = PARSER.Program.parse("(while 0 false)");
  const ctx = run(result.value);

  expect(ctx.error).not.toBe(null);
});

test("while condition", () => {
  const result = PARSER.Program.parse(
    "(set x 0) (while (lte x 3) (set x (add x 1))) x"
  );
  const ctx = run(result.value);

  expectResult(ctx, 4);
});
