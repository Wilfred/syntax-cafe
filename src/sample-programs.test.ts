import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";
import { helloworld, fizzbuzz, quine } from "./sample-programs";

import type { LangOpts } from "./options";

function parses(src: string, opts: LangOpts): boolean {
  const parser = buildParser(opts);
  const result = parser.Program.parse(src);

  return result.status;
}

describe("hello world", () => {
  it("should produce valid syntax with default options", () => {
    expect(parses(helloworld(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS));
  });
});

describe("fizzbuzz", () => {
  it("should produce valid syntax with default options", () => {
    expect(parses(fizzbuzz(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS));
  });
});

describe("quine", () => {
  it("should produce valid syntax with default options", () => {
    expect(parses(quine(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS));
  });
});
