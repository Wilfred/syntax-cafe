import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

const appNode = document.getElementById("app");

ReactDOM.render(<App />, appNode);

// let markers = [];

// setInterval(() => {
//   const commentRegexp = getCommentRegexp();

//   defineLangplzMode(commentRegexp);
//   editor.setOption("mode", "langplz");

//   const parser = buildParser(commentRegexp);
//   const s = editor.getValue();
//   const result = parser.Program.parse(s);

//   markers.forEach(m => {
//     m.clear();
//   });
//   markers = [];

//   if (!result.status) {
//     const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
//     const endPos = { line: result.index.line - 1, ch: result.index.column };

//     const m = editor.markText(pos, endPos, {
//       className: "syntax-error",
//       title: "foo",
//       css: "border-bottom: 1px dotted red;"
//     });
//     markers.push(m);

//     document.getElementById("ast-output").textContent = P.formatError(
//       s,
//       result
//     );
//   } else {
//     document.getElementById("ast-output").textContent = JSON.stringify(
//       result.value,
//       null,
//       "  "
//     );
//   }
// }, 300);

// const runBtn = document.getElementById("run");
// runBtn.onclick = function() {
//   const parser = buildParser(getCommentRegexp());
//   const s = editor.getValue();
//   const result = parser.Program.parse(s);

//   run(result.value.value);
// };
