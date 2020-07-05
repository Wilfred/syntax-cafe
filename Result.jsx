import React, { useState } from "react";
const P = require("parsimmon");

function Result(props) {
  const [tab, setTab] = useState("execution");

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

  let body = null;
  if (tab == "execution") {
    const output = props.stdout === null ? null : <pre>{props.stdout}</pre>;
    body = (
      <>
        {output}
        <button onClick={props.onRun} className="button">
          Run It
        </button>
      </>
    );
  } else if (tab == "parse-tree") {
    body = <pre>{parseResult}</pre>;
  }

  return (
    <div className="box">
      <h2 className="title">Enjoy 🍽️</h2>

      <div className="tabs">
        <ul>
          <li className={tab == "execution" ? "is-active" : ""}>
            <a onClick={() => setTab("execution")}>Execution</a>
          </li>
          <li className={tab == "parse-tree" ? "is-active" : ""}>
            <a onClick={() => setTab("parse-tree")}>Parse Tree</a>
          </li>
        </ul>
      </div>

      {error}
      {body}
    </div>
  );
}

module.exports = Result;
