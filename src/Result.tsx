import P from "parsimmon";

import React, { useState } from "react";

import { run } from "./interpret";
import type { Context } from "./interpret";
import type { LangOpts } from "./options";

const Result: React.FC<{ src: string; opts: LangOpts; parser: P.Language }> = ({
  src,
  opts,
  parser,
}) => {
  const [evalResult, setEvalResult] = useState<Context | null>(null);

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
          onClick={() => {
            if (result.status) {
              const ctx = run(result.value, opts);
              setEvalResult(ctx);
            }
          }}
          className="button"
        >
          🍽️ Run
        </button>
      </div>
      <div className="column">
        {output}
        {evalError}
      </div>
    </div>
  );
};
export default Result;
