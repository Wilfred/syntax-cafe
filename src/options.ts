import { Record, RecordOf } from "immutable";

type LangOptsObj = {
  commentPrefix: string;
  whileKeyword: string;
  ifKeyword: string;
  trueKeyword: string;
  falseKeyword: string;
  stringDelimiter: string;
  symbolRegexp: RegExp;
  expressionOriented: boolean,
};

export type LangOpts = RecordOf<LangOptsObj>;

const LangOptsFactory = Record<LangOptsObj>({
  commentPrefix: ";",
  whileKeyword: "while",
  ifKeyword: "if",
  trueKeyword: "true",
  falseKeyword: "false",
  stringDelimiter: '"',
  symbolRegexp: /[a-zA-Z_]+[a-zA-Z0-9_]*/,
  expressionOriented: true,
});

export const DEFAULT_LANG_OPTS: LangOpts = LangOptsFactory({});
