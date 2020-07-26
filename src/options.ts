import { Record } from "immutable";

export type LangOpts = {
  commentPrefix: string;
  whileKeyword: string;
  ifKeyword: string;
  trueKeyword: string;
  falseKeyword: string;
};

export const DEFAULT_LANG_OPTS = Record<LangOpts>({
  commentPrefix: ";",
  whileKeyword: "while",
  ifKeyword: "if",
  trueKeyword: "true",
  falseKeyword: "false",
})({});
