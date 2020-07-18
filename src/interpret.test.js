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

test("Adding literals", () => {
  const result = PARSER.Program.parse("(add 1 2)");
  const ctx = run(result.value);

  expectResult(ctx, 3);
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

test("Comparison", () => {
  const result = PARSER.Program.parse("(lte 1 42)");
  const ctx = run(result.value);

  // TODO: check no errors.
  // TODO: check name too.
  expectResult(ctx, true);
});

test("Comparison same", () => {
  const result = PARSER.Program.parse("(lte 5 5)");
  const ctx = run(result.value);

  expectResult(ctx, true);
});

test("Comparison false", () => {
  const result = PARSER.Program.parse("(lte 2 1)");
  const ctx = run(result.value);

  expectResult(ctx, false);
});

test("mod", () => {
  const result = PARSER.Program.parse("(mod 13 5)");
  const ctx = run(result.value);

  expectResult(ctx, 3);
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
