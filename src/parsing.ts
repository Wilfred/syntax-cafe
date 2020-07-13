import P from "parsimmon";
import regexpEscape from "regexp.escape";

export const SYMBOL_REGEXP = /[a-zA-Z]+/;

export function commentRegexp(prefix: string): RegExp {
  return new RegExp("\\s*" + regexpEscape(prefix) + "[^\n]*\\s*");
}

export function wordRegexp(content: string): RegExp {
  return new RegExp("\\b" + regexpEscape(content) + "\\b");
}

export function buildParser(
  commentPrefix: string,
  trueLiteral: string,
  falseLiteral: string
): P.Language {
  const commentPattern = commentRegexp(commentPrefix);

  return P.createLanguage({
    Program: r => r.Expression.sepBy(r._).trim(r._),
    Expression: function(r) {
      return P.alt(r.Number, r.BoolLiteral, r.Symbol, r.StringLiteral, r.List);
    },
    Number: function() {
      return P.regexp(/[0-9]+/)
        .map(Number)
        .node("Number");
    },
    BoolLiteral: function() {
      return P.alt(
        P.regexp(wordRegexp(trueLiteral)),
        P.regexp(wordRegexp(falseLiteral))
      )
        .map(s => s == trueLiteral)
        .node("Bool");
    },
    Symbol: function() {
      return P.regexp(SYMBOL_REGEXP).node("Symbol");
    },
    StringLiteral: function() {
      return P.regexp(/"((?:\\.|.)*?)"/, 1).node("String");
    },
    List: function(r) {
      return P.string("(")
        .then(r._)
        .then(r.Expression.sepBy(r._))
        .skip(P.string(")"))
        .node("List");
    },
    Comment: () => P.regexp(commentPattern),
    _: r => r.Comment.sepBy(P.optWhitespace).trim(P.optWhitespace)
  });
}
