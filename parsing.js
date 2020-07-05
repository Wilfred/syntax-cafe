import P from "parsimmon";
import regexpEscape from "regexp.escape";

export function commentRegexp(prefix) {
  return new RegExp("\\s*" + regexpEscape(prefix) + "[^\n]*\\s*");
}

export function boolLiteralRegexp(content) {
  return new RegExp("\\b" + regexpEscape(content) + "\\b");
}

export function buildParser(commentPrefix, trueLiteral, falseLiteral) {
  const commentPattern = commentRegexp(commentPrefix);

  return P.createLanguage({
    Program: r =>
      r.Value.sepBy(r._)
        .trim(r._)
        .node("Program"),
    Value: function(r) {
      return P.alt(r.Number, r.BoolLiteral, r.Symbol, r.String, r.List);
    },
    Number: function() {
      return P.regexp(/[0-9]+/).map(Number);
    },
    BoolLiteral: function() {
      return P.alt(
        P.regexp(boolLiteralRegexp(trueLiteral)),
        P.regexp(boolLiteralRegexp(falseLiteral))
      ).map(s => s == trueLiteral);
    },
    Symbol: function() {
      return P.regexp(/[a-z]+/);
    },
    String: function() {
      return P.regexp(/"((?:\\.|.)*?)"/, 1);
    },
    List: function(r) {
      return P.string("(")
        .then(r._)
        .then(r.Value.sepBy(r._))
        .skip(P.string(")"));
    },
    Comment: () => P.regexp(commentPattern),
    _: function(r) {
      return P.alt(
        P.seq(P.optWhitespace, r.Comment, P.optWhitespace),
        P.optWhitespace
      );
    }
  });
}
