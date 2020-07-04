import React from "react";
const CodeMirrorTag = require("./CodeMirrorTag");

function Editor(props) {
  return (
    <div className="box">
      <h2 className="title">Write Code 🍳</h2>
      <CodeMirrorTag
        initialValue={props.value}
        commentPrefix={props.commentPrefix}
        onChange={props.onChange}
      />
    </div>
  );
}

module.exports = Editor;
