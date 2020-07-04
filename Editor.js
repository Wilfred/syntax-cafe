import React from "react";
import { UnControlled as CodeMirrorTag } from "react-codemirror2";

const INITIAL_PROGRAM = '; Example\n(print "hello")';
const EDITOR_OPTS = {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
};

function Editor() {
  return (
    <div className="box">
      <h2 className="title">Write Code 🍳</h2>
      <CodeMirrorTag value={INITIAL_PROGRAM} options={EDITOR_OPTS} />
    </div>
  );
}

module.exports = Editor;
