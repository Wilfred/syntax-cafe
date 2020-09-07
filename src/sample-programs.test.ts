import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";
import { helloworld, fizzbuzz, quine } from "./sample-programs";

import type { LangOpts } from "./options";

function expectParseSuccess(src: string, opts: LangOpts): void {
  const parser = buildParser(opts);
  const result = parser.Program.parse(src);

  expect(result.status).toBe(true);
}

describe("hello world", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(helloworld(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });
});

describe("fizzbuzz", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(fizzbuzz(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });
});

describe("quine", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(quine(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });
});
