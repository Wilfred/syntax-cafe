import CodeMirrorTag from "./CodeMirrorTag";
import React from "react";

export default function Editor(props) {
  return (
    <div className="box">
      <h2 className="title">Write Code 🍳</h2>
      <CodeMirrorTag
        initialValue={props.value}
        commentPrefix={props.commentPrefix}
        onChange={props.onChange}
        errorRange={props.errorRange}
      />
    </div>
  );
}
