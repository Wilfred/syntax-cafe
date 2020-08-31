import { Record, RecordOf } from "immutable";

type LangOptsObj = {
  commentPrefix: string;
  whileKeyword: string;
  ifKeyword: string;
  trueKeyword: string;
  falseKeyword: string;
  stringDelimiter: string;
  symbolRegexp: RegExp;
};

export type LangOpts = RecordOf<LangOptsObj>;

const LangOptsFactory = Record<LangOptsObj>({
  commentPrefix: ";",
  whileKeyword: "while",
  ifKeyword: "if",
  trueKeyword: "true",
  falseKeyword: "false",
  stringDelimiter: '"',
  symbolRegexp: /[a-zA-Z]+[a-zA-Z0-9]*/,
});

export const DEFAULT_LANG_OPTS: LangOpts = LangOptsFactory({});
