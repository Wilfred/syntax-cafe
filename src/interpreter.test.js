/* eslint-env jest */
import { run } from "./interpreter";
import { buildParser } from "./parsing";

const parser = buildParser(";", "true", "false");

test("Boolean literal evaluation", () => {
  const result = parser.Program.parse("true");
  const ctx = run(result.value.value);

  expect(ctx.result.value).toBe(true);
});

test("String literal evaluation", () => {
  const result = parser.Program.parse('"foo"');
  const ctx = run(result.value.value);

  expect(ctx.result.value).toBe("foo");
});

test("Adding literals", () => {
  const result = parser.Program.parse("(add 1 2)");
  const ctx = run(result.value.value);

  expect(ctx.result.value).toBe(3);
});

test("Call nonexistent function", () => {
  const result = parser.Program.parse("(foo)");
  const ctx = run(result.value.value);

  expect(ctx.error).not.toBeNull();
});
