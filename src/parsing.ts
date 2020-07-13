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
    Expression: r => {
      return P.alt(
        r.Number,
        // Bools and keywords must come before general symbols.
        r.BoolLiteral,
        r.Symbol,
        r.StringLiteral,
        r.IfExpression,
        r.List
      );
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
      return P.regexp(SYMBOL_REGEXP)
        .assert((s: string) => s != "if", "a symbol, not a reserved word")
        .node("Symbol");
    },
    StringLiteral: function() {
      return P.regexp(/"((?:\\.|.)*?)"/, 1).node("String");
    },
    List: function(r) {
      return P.string("(")
        .skip(r._)
        .then(r.Expression.sepBy(r._))
        .skip(r._)
        .skip(P.string(")"))
        .node("List");
    },
    IfExpression: r => {
      return P.seq(
        // condition
        P.string("(")
          .skip(r._)
          .skip(P.string("if"))
          .skip(r._)
          .then(r.Expression)
          .skip(r._),
        // then
        r.Expression.skip(r._),
        // else (required)
        r.Expression.skip(r._).skip(P.string(")"))
      ).node("If");
    },
    Comment: () => P.regexp(commentPattern),
    _: r => r.Comment.sepBy(P.optWhitespace).trim(P.optWhitespace)
  });
}
