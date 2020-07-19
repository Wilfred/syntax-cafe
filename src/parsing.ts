import P from "parsimmon";
import regexpEscape from "regexp.escape";
import includes from "array-includes";

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
    Program: (r) => r.Expression.sepBy(r._).trim(r._),
    Expression: (r) => {
      return P.alt(
        r.Number,
        // Bools and keywords must come before general symbols.
        r.BoolLiteral,
        r.Symbol,
        r.StringLiteral,
        r.Assign,
        r.IfExpression,
        r.WhileLoop,
        r.Block,
        r.FunctionCall
      ).skip(r._);
    },
    Number: function () {
      return P.regexp(/[0-9]+/)
        .map(Number)
        .desc("number")
        .node("Number");
    },
    BoolLiteral: function () {
      return P.alt(
        P.regexp(wordRegexp(trueLiteral)),
        P.regexp(wordRegexp(falseLiteral))
      )
        .map((s) => s == trueLiteral)
        .desc("bool literal")
        .node("Bool");
    },
    Symbol: function () {
      return P.regexp(SYMBOL_REGEXP)
        .assert(
          // TODO: Submit PR for typing for parsimmon to allow .assert.
          (s: string) => {
            const keywords = ["if", "while", "set", "do", "true", "false"];
            return !keywords.includes(s);
          },
          "a symbol, not a reserved word"
        )
        .desc("symbol")
        .node("Symbol");
    },
    StringLiteral: function () {
      // TODO: Only handle specific escapes, not arbitrary \x \y.
      return P.regexp(/"((?:\\.|.)*?)"/, 1)
        .map((s) => s.replace(/\\n/g, "\n"))
        .desc("string literal")
        .node("String");
    },
    FunctionCall: (r) => {
      return P.seqObj<{ fun: any; args: Array<any> }>(
        P.string("(").skip(r._),
        // 'function' and 'arguments' are both reserved words in JS/TS.
        ["fun", r.Expression],
        ["args", r.Expression.many()],
        P.string(")")
      ).node("FunctionCall");
    },
    Block: (r) => {
      return P.seqObj<{ body: Array<any> }>(
        P.string("(").skip(r._),
        P.string("do").skip(r._),
        ["body", r.Expression.many()],
        P.string(")")
      ).node("Block");
    },
    IfExpression: (r) => {
      return P.seq(
        // condition
        P.string("(")
          .skip(r._)
          .skip(P.string("if"))
          .skip(r._)
          .then(r.Expression),
        // then
        r.Expression,
        // else (required)
        r.Expression.skip(P.string(")"))
      ).node("If");
    },
    Assign: (r) => {
      return P.seqObj<{ sym: any; value: any }>(
        P.string("(").skip(r._),
        P.string("set").skip(r._),
        ["sym", r.Symbol.skip(r._)],
        ["value", r.Expression],
        P.string(")")
      ).node("Assign");
    },
    WhileLoop: (r) => {
      return P.seq(
        // condition
        P.string("(")
          .skip(r._)
          .skip(P.string("while"))
          .skip(r._)
          .then(r.Expression),
        // body
        r.Expression.skip(P.string(")"))
      ).node("While");
    },
    Comment: () => P.regexp(commentPattern).desc("comment"),
    _: (r) => r.Comment.sepBy(P.optWhitespace).trim(P.optWhitespace),
  });
}
