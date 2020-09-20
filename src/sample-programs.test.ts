import P from "parsimmon";

import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";
import { helloworld, fizzbuzz, quine } from "./sample-programs";

import type { LangOpts } from "./options";

function expectParseSuccess(src: string, opts: LangOpts): void {
  const parser = buildParser(opts);
  const result = parser.Program.parse(src);

  if (!result.status) {
    console.warn(P.formatError(src, result));
  }

  expect(result.status).toBe(true);
}

describe("hello world", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(helloworld(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });

  it("should produce valid syntax with statements", () => {
    const opts = DEFAULT_LANG_OPTS.set("statementTerminator", ";");
    expectParseSuccess(helloworld(opts), opts);
  });
});

describe("fizzbuzz", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(fizzbuzz(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });

  it("should produce valid syntax with statements", () => {
    const opts = DEFAULT_LANG_OPTS.set("statementTerminator", ";");
    expectParseSuccess(fizzbuzz(opts), opts);
  });
});

describe("quine", () => {
  it("should produce valid syntax with default options", () => {
    expectParseSuccess(quine(DEFAULT_LANG_OPTS), DEFAULT_LANG_OPTS);
  });

  it("should produce valid syntax with statements", () => {
    const opts = DEFAULT_LANG_OPTS.set("statementTerminator", ";");
    expectParseSuccess(quine(opts), opts);
  });
});
