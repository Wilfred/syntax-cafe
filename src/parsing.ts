import includes from "array-includes";
import P from "parsimmon";
import regexpEscape from "regexp.escape";

import type { LangOpts } from "./options";

export function commentRegexp(prefix: string): RegExp {
  return new RegExp("\\s*" + regexpEscape(prefix) + "[^\n]*\\s*");
}

export function wordRegexp(content: string): RegExp {
  return new RegExp("\\b" + regexpEscape(content) + "\\b");
}

export function stringLiteralRegexp(delimiter: string): RegExp {
  const delimPattern = regexpEscape(delimiter);
  const literalPattern =
    // opening delimiter, e.g. "
    delimPattern +
    // A group of all the things that can occur inside a string.
    "(" +
    // Any single character that isn't a backslash.
    "[^\\\\]" +
    "|" +
    // An escaped newline \n
    "\\\\n" +
    "|" +
    // An escaped backslash \\
    "\\\\\\\\" +
    "|" +
    // An escaped delimiter \"
    ("\\\\" + delimPattern) +
    ")" +
    // Strings may be empty.
    "*?" +
    delimPattern;
  return new RegExp(literalPattern);
}

export function buildParser(opts: LangOpts): P.Language {
  const commentPattern = commentRegexp(opts.commentPrefix);

  return P.createLanguage({
    Program: (r) => r.Statement.sepBy(r._).trim(r._),
    Statement: (r) => {
      if (opts.statementTerminator === null) {
        return r.Expression;
      } else {
        return P.alt(
          r.Assign,
          r.IfExpression,
          r.WhileLoop,
          r.Block,
          r.Expression.skip(P.string(opts.statementTerminator))
        ).skip(r._);
      }
    },
    Expression: (r) => {
      let parser;
      if (opts.statementTerminator === null) {
        parser = P.alt(
          r.Number,
          r.BoolLiteral,
          r.StringLiteral,
          r.Symbol,
          r.Assign,
          r.IfExpression,
          r.WhileLoop,
          r.Block,
          r.FunctionCall
        );
      } else {
        return P.alt(
          r.Number,
          r.BoolLiteral,
          r.StringLiteral,
          r.Symbol,
          r.FunctionCall
        );
      }
      return parser.skip(r._).desc("expression");
    },
    Number: function () {
      return P.regexp(/[0-9]+/)
        .map(Number)
        .desc("number")
        .node("Number");
    },
    BoolLiteral: function () {
      return P.alt(
        P.regexp(wordRegexp(opts.trueKeyword)),
        P.regexp(wordRegexp(opts.falseKeyword))
      )
        .map((s) => s == opts.trueKeyword)
        .desc(`${opts.trueKeyword}, ${opts.falseKeyword}`)
        .node("Bool");
    },
    Symbol: function () {
      return P.regexp(opts.symbolRegexp)
        .assert((s: string) => {
          const keywords = [
            opts.ifKeyword,
            opts.whileKeyword,
            "set",
            "do",
            opts.trueKeyword,
            opts.falseKeyword,
          ];
          return !includes(keywords, s);
        }, "a symbol, not a reserved word")
        .desc("symbol")
        .node("Symbol");
    },
    StringLiteral: function () {
      return P.regexp(stringLiteralRegexp(opts.stringDelimiter))
        .map((s) => {
          const inner = s.slice(1, -1);

          const chars: Array<string> = [];
          let i = 0;
          while (i < inner.length) {
            const rest = inner.slice(i);

            if (rest.startsWith("\\n")) {
              chars.push("\n");
              i += 2;
            } else if (rest.startsWith("\\\\")) {
              chars.push("\\");
              i += 2;
            } else if (rest.startsWith("\\" + opts.stringDelimiter)) {
              chars.push(opts.stringDelimiter);
              i += opts.stringDelimiter.length + 1;
            } else {
              chars.push(inner[i]);
              i++;
            }
          }

          return chars.join("");
        })
        .desc(
          `string literal ${opts.stringDelimiter}...${opts.stringDelimiter}`
        )
        .node("String");
    },
    FunctionCall: (r) => {
      return P.seqObj<{ fun: any; args: Array<any> }>(
        P.string("(").skip(r._),
        // 'function' and 'arguments' are both reserved words in JS/TS.
        ["fun", r.Expression.skip(r._)],
        ["args", r.Expression.many()],
        P.string(")")
      ).node("FunctionCall");
    },
    Block: (r) => {
      let blockParser: P.Parser<{ body: Array<any> }>;

      if (opts.statementTerminator === null) {
        blockParser = P.seqObj(
          P.string("(").skip(r._),
          P.string("do").skip(r._),
          ["body", r.Expression.many()],
          P.string(")")
        );
      } else {
        blockParser = P.seqObj(
          P.string("{").skip(r._),
          ["body", r.Statement.many()],
          P.string("}")
        );
      }

      return blockParser.node("Block");
    },
    IfExpression: (r) => {
      let ifParser: P.Parser<{ condition: any; then: any; else: any }>;

      if (opts.statementTerminator === null) {
        ifParser = P.seqObj(
          P.string("(").skip(r._).skip(P.string(opts.ifKeyword)).skip(r._),
          ["condition", r.Expression],
          ["then", r.Expression],
          ["else", r.Expression],
          P.string(")")
        );
      } else {
        ifParser = P.seqObj(
          P.string(opts.ifKeyword).skip(r._),
          ["condition", r.Expression.skip(r._)],
          // TODO: require explicit blocks for then/else.
          ["then", r.Statement.skip(r._)],
          // TODO: highlight else as a keyword and ban as a variable name.
          P.string("else").skip(r._),
          ["else", r.Statement.skip(r._)]
        );
      }

      return ifParser.node("If");
    },
    Assign: (r) => {
      let parser: P.Parser<{ sym: any; value: any }>;

      if (opts.statementTerminator === null) {
        // (set x 1)
        parser = P.seqObj(
          P.string("(").skip(r._),
          // TODO: Only highlight this as a keyword in expression mode.
          P.string("set").skip(r._),
          ["sym", r.Symbol.skip(r._)],
          ["value", r.Expression],
          P.string(")")
        );
      } else {
        // x = 1;
        parser = P.seqObj(
          ["sym", r.Symbol.skip(r._)],
          // TODO: allow an arbitrary string here. := is probably a
          // nice choise too, for example.
          P.string("=").skip(r._),
          ["value", r.Expression.skip(r._)],
          P.string(opts.statementTerminator)
        );
      }

      return parser.node("Assign");
    },
    WhileLoop: (r) => {
      let parser;
      if (opts.statementTerminator === null) {
        parser = P.seq(
          // condition
          P.string("(")
            .skip(r._)
            .skip(P.string(opts.whileKeyword))
            .skip(r._)
            .then(r.Expression),
          // body
          r.Statement.skip(P.string(")"))
        );
      } else {
        parser = P.seq(
          // condition
          P.string(opts.whileKeyword).skip(r._).then(r.Expression).skip(r._),
          // body
          r.Statement
        );
      }

      return parser.node("While");
    },
    Comment: () => P.regexp(commentPattern).desc("comment"),
    _: (r) => r.Comment.sepBy(P.optWhitespace).trim(P.optWhitespace),
  });
}
