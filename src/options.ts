import { Record } from "immutable";

export type LangOpts = {
  commentPrefix: string;
  whileKeyword: string;
  trueKeyword: string;
  falseKeyword: string;
};

export const DEFAULT_LANG_OPTS = Record<LangOpts>({
  commentPrefix: ";",
  whileKeyword: "while",
  trueKeyword: "true",
  falseKeyword: "false",
})({});
