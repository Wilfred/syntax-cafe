/* eslint-env jest */
import { run } from "./interpreter";
import { buildParser } from "./parsing";

const parser = buildParser(";", "true", "false");

test("Boolean literal evaluation", () => {
  const result = parser.Program.parse("true");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(true);
});

test("Multiple expressions", () => {
  const result = parser.Program.parse("true false");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(false);
});

test("String literal evaluation", () => {
  const result = parser.Program.parse('"foo"');
  const ctx = run(result.value);

  expect(ctx.result.value).toBe("foo");
});

test("Adding literals", () => {
  const result = parser.Program.parse("(add 1 2)");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(3);
});

test("Unbound variable error", () => {
  const result = parser.Program.parse("nosuchvar");
  const ctx = run(result.value);

  expect(ctx.error).not.toBeNull();
  expect(ctx.error).toBe("Unbound variable: nosuchvar");
});

test("Unbound function in argument", () => {
  // Error should propagate.
  const result = parser.Program.parse("(add 1 (nosuchfunc))");
  const ctx = run(result.value);

  expect(ctx.error).not.toBeNull();
});

test("If expression: true", () => {
  const result = parser.Program.parse("(if true 2 (foo))");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(2);
});

test("If expression: false", () => {
  const result = parser.Program.parse("(if false (foo) 2)");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(2);
});

test("Call nonexistent function", () => {
  const result = parser.Program.parse("(foo)");
  const ctx = run(result.value);

  expect(ctx.error).not.toBeNull();
});

test("Assignment", () => {
  const result = parser.Program.parse("(set x 1) x");
  const ctx = run(result.value);

  expect(ctx.result.value).toBe(1);
});

test("while false", () => {
  const result = parser.Program.parse("(while false)");
  const ctx = run(result.value);

  expect(ctx.result).toBe(null);
});

test("while condition", () => {
  const result = parser.Program.parse("(set x true) (while x (set x false))");
  const ctx = run(result.value);

  expect(ctx.result).toBe(null);
});
