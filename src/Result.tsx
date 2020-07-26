import P, { formatError } from "parsimmon";

import React, { useState } from "react";

import type { LangOpts } from "./options";
import { run } from "./interpret";
import type { Context } from "./interpret";

const Result: React.FC<{ src: string; parser: P.Language }> = ({
  src,
  parser,
}) => {
  let [tab, setTab] = useState("execution");
  const [evalResult, setEvalResult] = useState<Context | null>(null);

  const result = parser.Program.parse(src);

  let parseResult = "";
  let error = null;
  if (!result.status) {
    error = (
      <div className="notification is-danger is-light">
        <pre>{formatError(src, result)}</pre>
      </div>
    );
    // Always show the parse tree output if we have a parse error.
    tab = "parse-tree";
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
            <pre>💥 {evalResult.error}</pre>
          </div>
        );
      }
    }
    body = (
      <>
        {output}
        {evalError}
        <button
          onClick={() => {
            if (result.status) {
              const ctx = run(result.value);
              setEvalResult(ctx);
            }
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
};
export default Result;
