import React, { useState } from "react";
import { formatError } from "parsimmon";
import { run } from "./interpreter";

export default function Result(props) {
  const [tab, setTab] = useState("execution");
  const [evalResult, setEvalResult] = useState(null);

  const src = props.src;
  const result = props.parser.Program.parse(src);

  let parseResult = "";
  let error = null;
  if (!result.status) {
    error = (
      <div className="notification is-danger is-light">
        <pre>{formatError(src, result)}</pre>
      </div>
    );
  } else {
    parseResult = JSON.stringify(result.value, null, "  ");
  }

  let body = null;
  if (tab == "execution") {
    let output = null;
    let evalError = null;

    if (evalResult !== null) {
      if (evalResult.stdout !== null) {
        output = <pre>{evalResult.stdout}</pre>;
      }
      if (evalResult.error !== null) {
        evalError = (
          <div className="notification is-danger is-light">
            <pre>{evalResult.error}</pre>
          </div>
        );
      }
    }
    body = (
      <>
        {evalError}
        {output}
        <button
          onClick={() => {
            // TODO: don't allow running broken syntax.
            const ctx = run(result.value.value);
            setEvalResult(ctx);
          }}
          className="button"
        >
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
