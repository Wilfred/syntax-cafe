import React from "react";
const P = require("parsimmon");
const buildParser = require("./parsing").buildParser;

function getCommentRegexp(prefix) {
  return new RegExp("\\s*" + escape(prefix) + "[^\n]*\\s*");
}
const COMMENT_REGEXP = ";";

function Enjoy(props) {
  const parser = buildParser(getCommentRegexp(props.commentPrefix));
  const src = props.src;
  const result = parser.Program.parse(src);

  let parseResult;
  if (!result.status) {
    parseResult = P.formatError(src, result);
  } else {
    parseResult = JSON.stringify(result.value, null, "  ");
  }

  return (
    <div className="box">
      <h2 className="title">Enjoy 🍽️</h2>

      <button id="run" className="button">
        Run It
      </button>
      <pre id="output">stdout here</pre>
      <pre id="ast-output">{parseResult}</pre>
    </div>
  );
}

module.exports = Enjoy;
