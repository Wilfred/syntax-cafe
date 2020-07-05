import React, { useState } from "react";
const LexerOptions = require("./LexerOptions");
const Editor = require("./Editor");
const Result = require("./Result");
const buildParser = require("./parsing").buildParser;
const run = require("./interpreter").run;

const INITIAL_PROGRAM = '; Example\n(print "hello")';

function App() {
  const [src, setSrc] = useState(INITIAL_PROGRAM);
  const [commentPrefix, setCommentPrefix] = useState(";");
  const parser = buildParser(commentPrefix);
  const [evalResult, setEvalResult] = useState(null);

  const result = parser.Program.parse(src);

  let errorRange = null;
  if (!result.status) {
    const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    const endPos = { line: result.index.line - 1, ch: result.index.column };

    errorRange = [pos, endPos];
  }

  return (
    <div>
      <LexerOptions
        commentPrefix={commentPrefix}
        setCommentPrefix={setCommentPrefix}
      />
      <Editor
        value={src}
        commentPrefix={commentPrefix}
        onChange={setSrc}
        errorRange={errorRange}
      />
      <Result
        src={src}
        parser={parser}
        evalResult={evalResult}
        onRun={() => {
          // TODO: don't allow running broken syntax.
          const ctx = run(result.value.value);
          setEvalResult(ctx);
        }}
      />
    </div>
  );
}

module.exports = App;
