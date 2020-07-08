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
