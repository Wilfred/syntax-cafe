import React from "react";

import CodeMirrorTag from "./CodeMirrorTag";

export default function Editor(props) {
  return (
    <div className="box">
      <h2 className="title">Write Code 🍳</h2>
      <CodeMirrorTag
        initialValue={props.value}
        commentPrefix={props.commentPrefix}
        trueLiteral={props.trueLiteral}
        falseLiteral={props.falseLiteral}
        onChange={props.onChange}
        errorRange={props.errorRange}
      />
    </div>
  );
}
