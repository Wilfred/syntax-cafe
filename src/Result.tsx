import P from "parsimmon";

import React, { useState } from "react";

import ParseTree from "./ParseTree";
import { run } from "./interpret";
import type { Context } from "./interpret";
import type { LangOpts } from "./options";

const Result: React.FC<{ src: string; opts: LangOpts; parser: P.Language }> = ({
  src,
  opts,
  parser,
}) => {
  const [evalResult, setEvalResult] = useState<Context | null>(null);
  const [mode, setMode] = useState("output");

  const result = parser.Program.parse(src);

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
  return (
    <div className="columns">
      <div className="column is-one-quarter">
        <button
          className="button is-large"
          onClick={() => {
            setMode("output");
            if (result.status) {
              const ctx = run(result.value, opts);
              setEvalResult(ctx);
            }
          }}
        >
          🍽️ Run
        </button>
        <br />
        <button
          className="button is-large"
          onClick={() => {
            setMode("parse-tree");
          }}
        >
          {result.status ? "🧂" : "💥"} Parse Tree
        </button>
        <br />
        <button className="button is-large" disabled>
          Reset
        </button>
      </div>
      <div className="column">
        {mode == "output" ? (
          <>
            {output}
            {evalError}
          </>
        ) : (
          <ParseTree src={src} result={result} />
        )}
      </div>
    </div>
  );
};
export default Result;
