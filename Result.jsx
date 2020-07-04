import React from "react";
const P = require("parsimmon");

function Result(props) {
  const src = props.src;
  const result = props.parser.Program.parse(src);

  let parseResult = "";
  let error = null;
  if (!result.status) {
    error = (
      <div className="notification is-danger is-light">
        <pre>{P.formatError(src, result)}</pre>
      </div>
    );
  } else {
    parseResult = JSON.stringify(result.value, null, "  ");
  }

  return (
    <div className="box">
      <h2 className="title">Enjoy 🍽️</h2>

      <pre id="output">stdout here</pre>
      {error}
      <pre>{parseResult}</pre>

      <button id="run" className="button">
        Run It
      </button>
    </div>
  );
}

module.exports = Result;