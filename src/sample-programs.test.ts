import { DEFAULT_LANG_OPTS } from "./options";
import { buildParser } from "./parsing";
import { helloworld, fizzbuzz, quine } from "./sample-programs";

const PARSER = buildParser(DEFAULT_LANG_OPTS);

describe("hello world", () => {
  it("should produce valid syntax with default options", () => {
    const result = PARSER.Program.parse(helloworld(DEFAULT_LANG_OPTS));

    expect(result.status).toBe(true);
  });
});

describe("fizzbuzz", () => {
  it("should produce valid syntax with default options", () => {
    const result = PARSER.Program.parse(fizzbuzz(DEFAULT_LANG_OPTS));

    expect(result.status).toBe(true);
  });
});

describe("quine", () => {
  it("should produce valid syntax with default options", () => {
    const result = PARSER.Program.parse(quine(DEFAULT_LANG_OPTS));

    expect(result.status).toBe(true);
  });
});
