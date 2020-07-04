import React from "react";
import { UnControlled as CodeMirrorTag } from "react-codemirror2";

const EDITOR_OPTS = {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
};

function Editor(props) {
  return (
    <div className="box">
      <h2 className="title">Write Code 🍳</h2>
      <CodeMirrorTag
        value={props.value}
        options={EDITOR_OPTS}
        onChange={(editor, data, value) => {
          props.onChange(value);
        }}
      />
    </div>
  );
}

module.exports = Editor;
